import request from "supertest";
import app from "../server";

describe("POST /api/auth/verify-otp", () => {
  it("should return 400 for invalid or expired OTP", async () => {
    const response = await request(app)
      .post("/api/auth/verify-otp")
      .send({ phone: "1234567890", otp: "999999" });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid or expired OTP");
  });
});
