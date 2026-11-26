/**
 * API client for the Restful Booker service.
 * Wraps Playwright's APIRequestContext so tests read like business steps.
 */
class BookingClient {
  /** @param {import('@playwright/test').APIRequestContext} request */
  constructor(request) {
    this.request = request;
  }

  async createToken(username, password) {
    const response = await this.request.post('/auth', { data: { username, password } });
    const body = await response.json();
    return { response, token: body.token };
  }

  async createBooking(booking) {
    return this.request.post('/booking', { data: booking });
  }

  async getBooking(id) {
    return this.request.get(`/booking/${id}`);
  }

  async getBookingIds(params = {}) {
    return this.request.get('/booking', { params });
  }

  async updateBooking(id, booking, token) {
    return this.request.put(`/booking/${id}`, {
      data: booking,
      headers: token ? { Cookie: `token=${token}` } : {},
    });
  }

  async partialUpdateBooking(id, fields, token) {
    return this.request.patch(`/booking/${id}`, {
      data: fields,
      headers: token ? { Cookie: `token=${token}` } : {},
    });
  }

  async deleteBooking(id, token) {
    return this.request.delete(`/booking/${id}`, {
      headers: token ? { Cookie: `token=${token}` } : {},
    });
  }

  async healthCheck() {
    return this.request.get('/ping');
  }
}

module.exports = { BookingClient };
