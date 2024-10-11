import { PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()


class VerificationService {
  /**
   * Gets the most recent code by customer email
   * @param email 
   * @returns verification object, code at verification.code
   * @throws Error('InvalidParameters')
   */
  public async getCode(email: string) {
    if(!email) {
      throw new Error('InvalidParameters');
    }
    const verification = await prisma.verifications.findFirst({
      where: {
        customerEmail: email
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return verification;
  }

  /**
   * Generates a code and applies it to a database
   * @param email 
   * @returns 
   */

  public async generateCode(email: string) {

    const code = Math.floor(100000 + Math.random() * 900000);

    const newVerification = await prisma.verifications.create({
      data: {
        customerEmail: email,
        code
      }
    });

    return newVerification;
  }
}

export default VerificationService;