import { JwtService, JwtPayload } from '../JwtService';

describe('JwtService', () => {
  const mockPayload: JwtPayload = {
    userId: '123',
    email: 'test@example.com',
    role: 'user',
  };

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = JwtService.generateToken(mockPayload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should generate different tokens for different payloads', () => {
      const payload1: JwtPayload = { userId: '1', email: 'user1@example.com', role: 'user' };
      const payload2: JwtPayload = { userId: '2', email: 'user2@example.com', role: 'admin' };

      const token1 = JwtService.generateToken(payload1);
      const token2 = JwtService.generateToken(payload2);

      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode a valid token', () => {
      const token = JwtService.generateToken(mockPayload);
      const decoded = JwtService.verifyToken(token);

      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.role).toBe(mockPayload.role);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      expect(() => JwtService.verifyToken(invalidToken)).toThrow('Invalid or expired token');
    });

    it('should throw error for malformed token', () => {
      const malformedToken = 'notavalidjwttoken';
      expect(() => JwtService.verifyToken(malformedToken)).toThrow('Invalid or expired token');
    });

    it('should throw error for empty token', () => {
      expect(() => JwtService.verifyToken('')).toThrow('Invalid or expired token');
    });

    it('should contain expiration info in verified token', () => {
      const token = JwtService.generateToken(mockPayload);
      const decoded = JwtService.verifyToken(token) as any;

      expect(decoded.iat).toBeDefined(); // issued at
      expect(decoded.exp).toBeDefined(); // expiration
    });
  });

  describe('token lifecycle', () => {
    it('should successfully generate and verify token', () => {
      const payload: JwtPayload = {
        userId: 'user-456',
        email: 'admin@example.com',
        role: 'admin',
      };

      const token = JwtService.generateToken(payload);
      const decoded = JwtService.verifyToken(token);

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
    });
  });
});
