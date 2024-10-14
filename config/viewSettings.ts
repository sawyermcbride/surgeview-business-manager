type Role = 'Admin' | 'manager' | 'associate';

interface Settings {
  searchCustomers: boolean;
  searchOrders: boolean;
  viewOrders: boolean;
  editOrders: boolean;
  editCustomers: boolean;
  addEmployee: boolean;
  editEmployee: boolean;
  deleteEmployee: boolean;
  viewEmployees: boolean;
  viewReports: boolean;
  resetPassword: boolean;
}

const viewSettings: Record<Role, Settings> = {
  Admin: {
    searchCustomers: true,
    searchOrders: true,
    viewOrders: true,
    editOrders: true,
    editCustomers: true,
    addEmployee: true,
    editEmployee: true,
    deleteEmployee: true,
    viewEmployees: true,
    viewReports: true,
    resetPassword: true
  },
  manager: {
    searchCustomers: true,
    searchOrders: true,
    viewOrders: true,
    editOrders: true,
    editCustomers: true,
    addEmployee: false,
    editEmployee: true,
    deleteEmployee: false,
    viewEmployees: true,
    viewReports: true,
    resetPassword: false
  },
  associate: {
    searchCustomers: true,
    searchOrders: true,
    viewOrders: true,
    editOrders: true,
    editCustomers: false,
    addEmployee: false,
    editEmployee: false,
    deleteEmployee: false,
    viewEmployees: false,
    viewReports: true,
    resetPassword: false
  }
}

export default viewSettings;