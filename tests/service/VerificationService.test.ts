import { PrismaClient } from "@prisma/client";
import {jest, expect, test, describe, beforeEach} from "@jest/globals";
import VerificationService from "../../service/VerificationService";

jest.mock('prisma');

const prismaMock = new PrismaClient() as jest.Mocked<PrismaClient>;

describe('VerificationService', () => {

let verificationService = new VerificationService();

  beforeEach(() => {

    jest.clearAllMocks(); 
  });
  describe('getCode', () => {
    test('should throw an error if email is not provided', async () => {
      await expect(verificationService.getCode('')).rejects.toThrow('InvalidParameters');
    });

    test('should return the most recent verification code for the given email', async () => {
      const email = 'test@example.com';
      const mockVerification = {
        id: 1,
        customerEmail: email,
        code: 123456,
        createdAt: new Date(),
      };

      (prismaMock.verifications.findFirst).mockResolvedValue(mockVerification);

      const result = await verificationService.getCode(email);

      expect(prismaMock.verifications.findFirst).toHaveBeenCalledWith({
        where: { customerEmail: email },
        orderBy: { createdAt: 'desc' },
      });

      expect(result).toEqual(mockVerification);
    });

    test('should return null if no verification is found', async () => {
      const email = 'test@example.com';

      (prismaMock.verifications.findFirst).mockResolvedValue(null);

      const result = await verificationService.getCode(email);

      expect(prismaMock.verifications.findFirst).toHaveBeenCalledWith({
        where: { customerEmail: email },
        orderBy: { createdAt: 'desc' },
      });

      expect(result).toBeNull();
    });
  });

  describe('generateCode', () => {
    test('should generate a verification code and save it in the database', async () => {
      const email = 'test@example.com';
      const mockVerification = {
        id: 1,
        customerEmail: email,
        code: 123456,
        createdAt: new Date(),
      };

      (prismaMock.verifications.create).mockResolvedValue(mockVerification);

      const result = await verificationService.generateCode(email);

      expect(prismaMock.verifications.create).toHaveBeenCalledWith({
        data: {
          customerEmail: email,
          code: expect.any(Number), 
        },
      });

      expect(result).toEqual(mockVerification);
    });
  });
});