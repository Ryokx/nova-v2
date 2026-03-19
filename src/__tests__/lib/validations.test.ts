import { registerSchema, loginSchema } from "@/lib/validations";

describe("registerSchema", () => {
  it("accepts valid registration data", () => {
    const result = registerSchema.safeParse({
      name: "Jean Dupont",
      email: "jean@example.com",
      password: "Password1",
      role: "CLIENT",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short name", () => {
    const result = registerSchema.safeParse({
      name: "J",
      email: "jean@example.com",
      password: "Password1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = registerSchema.safeParse({
      name: "Jean Dupont",
      email: "not-an-email",
      password: "Password1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = registerSchema.safeParse({
      name: "Jean Dupont",
      email: "jean@example.com",
      password: "Pass1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without uppercase", () => {
    const result = registerSchema.safeParse({
      name: "Jean Dupont",
      email: "jean@example.com",
      password: "password1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without number", () => {
    const result = registerSchema.safeParse({
      name: "Jean Dupont",
      email: "jean@example.com",
      password: "Password",
    });
    expect(result.success).toBe(false);
  });

  it("defaults role to CLIENT", () => {
    const result = registerSchema.safeParse({
      name: "Jean Dupont",
      email: "jean@example.com",
      password: "Password1",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.role).toBe("CLIENT");
    }
  });

  it("accepts ARTISAN role", () => {
    const result = registerSchema.safeParse({
      name: "Jean",
      email: "jean@example.com",
      password: "Password1",
      role: "ARTISAN",
    });
    expect(result.success).toBe(true);
  });
});

describe("loginSchema", () => {
  it("accepts valid login data", () => {
    const result = loginSchema.safeParse({
      email: "jean@example.com",
      password: "anything",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "bad",
      password: "anything",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "jean@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});
