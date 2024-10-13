
import {useState} from "react";

import axios from "axios";

//POST /api/customers/search/
interface UpdateOrdersReturnObject {
  updateOrder: (orderId: number, youtubeUrl: string, channelName: string) => void;
  response: UpdateOrdersResponseObject;
  loading: boolean;
  error: string | null;
}

interface UpdateOrdersResponseObject {
  message: string;
  orderId: number | null;
}

const useFetchUpdateOrders = function(): UpdateOrdersReturnObject {
  const [response, setResponse] = useState<UpdateOrdersResponseObject>({
    message: '', orderId: null
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateOrder = async function(orderId: number, youtubeUrl: string, channelName: string) {
    setError(null)
    setLoading(true);

    try {
      const response = await axios.put(
        'http://localhost:3000/api/orders/update',
        {
          orderId,
          youtubeUrl: youtubeUrl || "",
          channelName: channelName || ""
        }, 
        {
          withCredentials: true 
        }
      );

      const contentType = response.headers['content-type'];

      if(contentType.includes('application/json')) {
        setResponse(response.data);
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
    }

  }

  
  return {updateOrder, response, loading, error};
}

export default useFetchUpdateOrders;