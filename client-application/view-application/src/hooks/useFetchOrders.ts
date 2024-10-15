
import {useState} from "react";
import { OrdersObject } from "../types/apiResponses";
import axios from "axios";


//POST /api/customers/search/
interface FetchOrdersReturnObject {
  orders: OrdersObject[];
  loading: boolean;
  error: string | null;
  fetchOrders: (startDate?: string, endDate?: string) => void
}

const useFetchOrders = function(): FetchOrdersReturnObject {
  const [orders, setOrders] = useState<OrdersObject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async function(startDate?: string, endDate?: string) {
    setError(null)
    setLoading(true);

    try {

      let url: string;

      if(startDate && endDate) {
        url = `http://localhost:3000/api/orders?start=${startDate}&end=${endDate}`;
      } else {
        url = `http://localhost:3000/api/orders`;
      }

      const response = await axios.get(url,
        {
          withCredentials: true 
        }
      );

      const contentType = response.headers['content-type'];

      if(contentType.includes('application/json')) {
        console.log('JSON received');
        setOrders(response.data);
      } else if(contentType.includes('text/html') && response.data.includes('Login')) {
        setError('Authorization_Error');
      }

      setLoading(false);

    } catch(err) {
      if(axios.isAxiosError(err)) {
        setError(err.message);
      } else {
        setError('Unknown error occured');
      }
      setLoading(false);
    }

  }
  
  return {orders, loading, error, fetchOrders};
}

export default useFetchOrders;