#include <linux/i2c-dev.h>
#include <sys/ioctl.h>
#include <fcntl.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include "bme280.h"

/* --- I2C Communication Functions (v4.x Signature) --- */
/* Note: uint32_t len and void* intf_ptr are used here */
int8_t user_i2c_read(uint8_t reg_addr, uint8_t *reg_data, uint32_t len, void *intf_ptr) {
    int fd = *(int*)intf_ptr;
    if (write(fd, &reg_addr, 1) != 1) return BME280_E_COMM_FAIL;
    if (read(fd, reg_data, len) != len) return BME280_E_COMM_FAIL;
    return BME280_OK;
}

int8_t user_i2c_write(uint8_t reg_addr, const uint8_t *reg_data, uint32_t len, void *intf_ptr) {
    int fd = *(int*)intf_ptr;
    uint8_t buf[len + 1];
    buf[0] = reg_addr;
    memcpy(&buf[1], reg_data, len);
    if (write(fd, buf, len + 1) != len + 1) return BME280_E_COMM_FAIL;
    return BME280_OK;
}

void user_delay_us(uint32_t period, void *intf_ptr) {
    usleep(period);
}

int main() {
    struct bme280_dev dev;
    struct bme280_settings settings;
    struct bme280_data data;
    int fd;
    int8_t rslt;

    if ((fd = open("/dev/i2c-1", O_RDWR)) < 0) {
        fprintf(stderr, "{\"error\": \"Failed to open i2c bus\"}\n");
        return 1;
    }

    uint8_t dev_addr = BME280_I2C_ADDR_PRIM; 
    if (ioctl(fd, I2C_SLAVE, dev_addr) < 0) {
        fprintf(stderr, "{\"error\": \"Sensor not found at 0x%02x\"}\n", dev_addr);
        close(fd);
        return 1;
    }

    dev.intf = BME280_I2C_INTF;
    dev.read = user_i2c_read;
    dev.write = user_i2c_write;
    dev.delay_us = user_delay_us;
    dev.intf_ptr = &fd;

    rslt = bme280_init(&dev);
    if (rslt != BME280_OK) {
        fprintf(stderr, "{\"error\": \"Init failed\", \"code\": %d}\n", rslt);
        close(fd);
        return 1;
    }

    // Recommended: Get current settings to maintain defaults for un-set values
    rslt = bme280_get_sensor_settings(&settings, &dev);
    
    settings.osr_h = BME280_OVERSAMPLING_1X;
    settings.osr_p = BME280_OVERSAMPLING_16X;
    settings.osr_t = BME280_OVERSAMPLING_2X;
    settings.filter = BME280_FILTER_COEFF_16;

    uint8_t settings_sel = BME280_SEL_OSR_PRESS | BME280_SEL_OSR_TEMP | BME280_SEL_OSR_HUM | BME280_SEL_FILTER;
    rslt = bme280_set_sensor_settings(settings_sel, &settings, &dev);

    // Trigger measurement
    rslt = bme280_set_sensor_mode(BME280_POWERMODE_FORCED, &dev);
    
    // Wait for measurement to complete
    uint32_t max_delay;
    bme280_cal_meas_delay(&max_delay, &settings);
    dev.delay_us(max_delay, dev.intf_ptr);

    // Read and output
    rslt = bme280_get_sensor_data(BME280_ALL, &data, &dev);

    if (rslt == BME280_OK) {
        // Output as valid JSON
        printf("{\"temperature\": %.2f, \"pressure\": %.2f, \"humidity\": %.2f}\n", 
               data.temperature, 
               data.pressure / 100.0, // Convert Pa to hPa
               data.humidity);
    } else {
        printf("{\"error\": \"Data read failed\", \"code\": %d}\n", rslt);
    }

    close(fd);
    return 0;
}