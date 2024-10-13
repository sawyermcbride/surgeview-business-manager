import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class CustomersService {
  
  /**
   * 
   * @param id 
   * @returns 
   * @throws Error('NoCustomer') - if the provided id does not belong to a customer
   * @throws Error('') - for other errors relating to database access
   */
  public async getCustomerData(id: number) {

    const customer = await prisma.customers.findUnique({
      where: {
        id
      }
    });
  
    if(!customer) {
      throw new Error('NoCustomer');
    }
  
    const orders = await prisma.orders.findMany({
      where: {
        customerEmail: customer.email
      },
      orderBy: {createdAt: 'desc'}
    });
  
    const responseObj = {
      customer,
      orders
    }

    return responseObj;

  }
  /**
   * Returns list of customers associated with the given search term 
   * @param searchText email or username associated with customer
   * @returns array of customer objects
   * @throws Error('NoCustomer) if no customer is found
   */
  public async searchCustomers(searchText: string) {
    
    const customers = await prisma.customers.findMany({
        where: {
            OR: [
                {
                    email: {
                        contains: searchText, // Matches if email contains searchText
                        mode: 'insensitive',  // Case insensitive
                    },
                },
                {
                    name: {
                        contains: searchText, // Matches if name contains searchText
                        mode: 'insensitive',  // Case insensitive
                    },
                },
            ],
        },
    });

    return customers;

  }
  /**
   * Created new customer 
   * @param name 
   * @param email 
   * @returns Object: {created: boolean, customer: Object}
   * @throws
   */

  public async createCustomer(name: string, email: string) {
    
    if(!name || !email) {
      throw new Error('InvalidParameters');    
    }

    const existingCustomer = await prisma.customers.findUnique({
      where: {
        email
      }
    });

    if(existingCustomer) {
      return {created: false, customer: existingCustomer};
    }

    const newCustomer = await prisma.customers.create({
      data: {
        name,
        email
      }
    })

    return {created: true, customer: newCustomer};

  }

}

export default CustomersService;