import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();


  class EmployeesService {
    /**
     * Logs in the user
     * @param username 
     * @param password 
     * @throws Error('InvalidPassword) - if password is invalid
     * @throws Error('NoUser) - if user is not found
     */
    public async login(username: string, password: string) {
      

      console.log('findUnique function ', prisma.employees.findUnique);

      const user = await prisma.employees.findUnique({
        where: {
          username
        }
      });
      
      console.log(user);
      if(!user) {
        throw new Error('NoUser');
      }
    
      const isMatch = await bcrypt.compare(password, user.password);

      if(!isMatch) {
        throw new Error('InvalidPassword');
      }
      return user;

    }

  /**
   * 
   * @param id 
   * @returns User
   * @throws Error('NoUser')
   */
  public async getUserById (id: number) {
    const user = await prisma.employees.findUnique({
      where: {
        id
      }
    });
    if(!user) {
      throw new Error('NoUser');
    }
    
    return user;
  
  }
  /**
   * Creates new login
   * @param name 
   * @param username 
   * @param email 
   * @param password 
   * @param role 
   * @throws Error('DuplicateUser') - if user already exists
   */

  public async createLogin(name: string, username: string, email: string, password: string, role: string) {
    const user = await prisma.employees.findUnique({
      where: {
        username,
        email
      }
    })
    
    if(user) {
      throw new Error('DuplicateUser');
    }
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.employees.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,  
        role
      }
    });

    return newUser; 
  }
}
export default EmployeesService;