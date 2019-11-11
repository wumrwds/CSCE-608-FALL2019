package edu.tamu.wumrwds.database.util;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.Date;

/**
 * Utilities to get specified format date time string.
 *
 * @author wumrwds
 */
public class DateTimeUtils {

    /** Time default format pattern */
    private static final String TIME_DEFAULT_FORMAT = "HH:mm:ss";

    /** Date default format pattern */
    private static final String DATE_DEFAULT_FORMAT = "yyyy-MM-dd";

    /** Date-Time default format pattern */
    private static final String DATETIME_DEFAULT_FORMAT = "yyyy-MM-dd HH:mm:ss";

    /** Time default format */
    private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern(DATE_DEFAULT_FORMAT);

    /** Date default format */
    private static final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern(TIME_DEFAULT_FORMAT);

    /** Date-Time default format */
    private static final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(DATETIME_DEFAULT_FORMAT);



    private DateTimeUtils() {
        // private constructor
    }




    /**
     * Transforms Java date object to date format string.
     *
     * @param date date object
     * @return date string in 'yyyy-MM-dd' pattern
     */
    public static String formatDate(Date date) {
        LocalDate localDate = genLocalDateTime(date).toLocalDate();
        return localDate.format(dateFormatter);
    }

    /**
     * Transforms Java date object to time format string.
     *
     * @param date date object
     * @return time string in 'HH:mm:ss' pattern
     */
    public static String formatTime(Date date) {
        LocalTime localTime = genLocalDateTime(date).toLocalTime();
        return localTime.format(timeFormatter);
    }

    /**
     * Transforms Java date object to date-time format string.
     *
     * @param date date object
     * @return date-time string in 'yyyy-MM-dd HH:mm:ss' pattern
     */
    public static String formatDateTime(Date date) {
        LocalDateTime localDateTime = genLocalDateTime(date);
        return localDateTime.format(dateTimeFormatter);
    }




    /**
     * Returns current date-time string in 'yyyy-MM-dd HH:mm:ss' pattern.
     *
     * @return date-time string in 'yyyy-MM-dd HH:mm:ss' pattern
     */
    public static String currentDateTime() {
        return LocalDateTime.now().format(dateTimeFormatter);
    }

    /**
     * Returns current date string in 'yyyy-MM-dd' pattern.
     *
     * @return date string in 'yyyy-MM-dd' pattern
     */
    public static String currentDate() {
        return LocalDate.now().format(dateFormatter);
    }




    /**
     * Parses date-time string with 'yyyy-MM-dd HH:mm:ss' pattern.
     *
     * @param dateTime date-time string
     * @return LocalDateTime
     */
    public static LocalDateTime parseDateTime(String dateTime) {
        return LocalDateTime.parse(dateTime, dateTimeFormatter);
    }

    /**
     * Parses date string with 'yyyy-MM-dd' pattern.
     *
     * @param date date string
     * @return LocalDate
     */
    public static LocalDate parseDate(String date) {
        return LocalDate.parse(date, dateFormatter);
    }

    /**
     * Parses date-time string with 'HH:mm:ss' pattern.
     *
     * @param time time string
     * @return LocalTime
     */
    public static LocalTime parseTime(String time) {
        return LocalTime.parse(time, timeFormatter);
    }



    /**
     * Helps to generate LocalDateTime by specified date time.
     *
     * @param date date time
     * @return LocalDateTime in conformity with specified date time
     */
    private static LocalDateTime genLocalDateTime(Date date) {
        Instant instant = date.toInstant();
        ZoneId zone = ZoneId.systemDefault();
        return LocalDateTime.ofInstant(instant, zone);
    }

}
