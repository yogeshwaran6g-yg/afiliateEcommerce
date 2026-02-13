import { queryRunner } from '#src/config/db.js';
import notificationService from '#src/services/notificationService.js';
import { log } from '#src/utils/helper.js';

const runNotificationTest = async () => {
    log("Starting Notification Service Verification...", "info");

    try {
        // 1. Setup - Clear existing notifications (optional for test isolation)
        await queryRunner("DELETE FROM notifications");
        log("Cleared existing notifications for testing.", "success");

        // 2. Test Create
        const notificationData = {
            heading: 'Test Notification',
            short_description: 'Test short desc',
            long_description: 'Test long desc',
            image_url: 'http://example.com/test.jpg',
            advertisement_end_time: '2026-12-31 23:59:59'
        };

        const createRes = await notificationService.create(notificationData);
        if (createRes.success) {
            log("Test Notification Create: PASSED", "success");
        } else {
            log(`Test Notification Create: FAILED (${createRes.msg})`, "error");
        }

        const notificationId = createRes.data.id;

        // 3. Test Get
        const getRes = await notificationService.get({ id: notificationId });
        if (getRes.success && getRes.data.length > 0 && getRes.data[0].heading === 'Test Notification') {
            log("Test Notification Get by ID: PASSED", "success");
        } else {
            log("Test Notification Get by ID: FAILED", "error");
        }

        // 4. Test Update
        const updateRes = await notificationService.update(notificationId, { heading: 'Updated Heading' });
        if (updateRes.success) {
            log("Test Notification Update: PASSED", "success");
        } else {
            log("Test Notification Update: FAILED", "error");
        }

        // Verify Update
        const verifyUpdate = await notificationService.get({ id: notificationId });
        if (verifyUpdate.success && verifyUpdate.data[0].heading === 'Updated Heading') {
            log("Verification of Notification Update: PASSED", "success");
        } else {
            log("Verification of Notification Update: FAILED", "error");
        }

        // 5. Test Delete
        const deleteRes = await notificationService.delete(notificationId);
        if (deleteRes.success) {
            log("Test Notification Delete: PASSED", "success");
        } else {
            log("Test Notification Delete: FAILED", "error");
        }

        // Verify Delete
        const verifyDelete = await notificationService.get({ id: notificationId });
        if (verifyDelete.success && (verifyDelete.data === null || verifyDelete.data.length === 0)) {
            log("Verification of Notification Delete: PASSED", "success");
        } else {
            log("Verification of Notification Delete: FAILED", "error");
        }

        log("Notification Service Verification Completed!", "success");
        process.exit(0);
    } catch (err) {
        log(`Notification Verification Failed: ${err.message}`, "error");
        process.exit(1);
    }
};

runNotificationTest();
