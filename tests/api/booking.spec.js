const { test, expect } = require('../../src/fixtures/test');
const { buildBooking } = require('../../src/data/testData');
const env = require('../../src/utils/env');

test.describe('Booking API', () => {
  test('health check returns 201 @smoke', async ({ bookingClient }) => {
    const response = await bookingClient.healthCheck();
    expect(response.status()).toBe(201);
  });

  test('auth returns a token for valid credentials @smoke', async ({ bookingClient }) => {
    const { response, token } = await bookingClient.createToken(env.API_USERNAME, env.API_PASSWORD);

    expect(response.status()).toBe(200);
    expect(token).toEqual(expect.any(String));
    expect(token.length).toBeGreaterThan(5);
  });

  test('auth rejects invalid credentials @regression', async ({ bookingClient }) => {
    const { response, token } = await bookingClient.createToken('admin', 'wrong-password');

    expect(response.status()).toBe(200); // this API reports auth failure in the body
    expect(token).toBeUndefined();
    expect(await response.json()).toEqual({ reason: 'Bad credentials' });
  });

  test('create booking returns the saved booking with an id @smoke', async ({ bookingClient, authToken }) => {
    const payload = buildBooking();

    const response = await bookingClient.createBooking(payload);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(body.bookingid).toEqual(expect.any(Number));
    expect(body.booking).toEqual(payload);

    // cleanup
    await bookingClient.deleteBooking(body.bookingid, authToken);
  });

  test('get booking returns the same data that was created @regression', async ({ bookingClient, createdBooking }) => {
    const response = await bookingClient.getBooking(createdBooking.id);

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(createdBooking.payload);
  });

  test('booking can be found by guest name @regression', async ({ bookingClient, createdBooking }) => {
    const response = await bookingClient.getBookingIds({
      firstname: createdBooking.payload.firstname,
      lastname: createdBooking.payload.lastname,
    });

    expect(response.status()).toBe(200);
    const ids = (await response.json()).map((b) => b.bookingid);
    expect(ids).toContain(createdBooking.id);
  });

  test('full update (PUT) replaces the booking @regression', async ({ bookingClient, createdBooking, authToken }) => {
    const updated = buildBooking({ firstname: 'Updated', totalprice: 499, depositpaid: false });

    const response = await bookingClient.updateBooking(createdBooking.id, updated, authToken);
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(updated);

    // verify the change was persisted
    const getResponse = await bookingClient.getBooking(createdBooking.id);
    expect(await getResponse.json()).toEqual(updated);
  });

  test('partial update (PATCH) changes only the given fields @regression', async ({ bookingClient, createdBooking, authToken }) => {
    const response = await bookingClient.partialUpdateBooking(
      createdBooking.id,
      { totalprice: 999, additionalneeds: 'Late checkout' },
      authToken
    );

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({
      ...createdBooking.payload,
      totalprice: 999,
      additionalneeds: 'Late checkout',
    });
  });

  test('update without a token is forbidden @regression', async ({ bookingClient, createdBooking }) => {
    const response = await bookingClient.updateBooking(createdBooking.id, buildBooking());
    expect(response.status()).toBe(403);
  });

  test('deleted booking can no longer be retrieved @regression', async ({ bookingClient, authToken }) => {
    const created = await (await bookingClient.createBooking(buildBooking())).json();

    const deleteResponse = await bookingClient.deleteBooking(created.bookingid, authToken);
    expect(deleteResponse.status()).toBe(201);

    const getResponse = await bookingClient.getBooking(created.bookingid);
    expect(getResponse.status()).toBe(404);
  });
});
