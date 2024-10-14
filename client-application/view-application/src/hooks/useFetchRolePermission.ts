import {useState, useEffect} from "react";
import { RoleSettings } from "../types/apiResponses";
import axios from "axios";

interface RolePermissionsReturnType {
  data: RoleSettings | undefined;
  loading: boolean;
  error: string;
  fetchPermissions: () => void
}

const useFetchRolePermissions = function(): RolePermissionsReturnType {
  const [data, setData] = useState<RoleSettings>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchPermissions = async function() {
    setError("")
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:3000/api/get-view-settings`,
        {
          withCredentials: true 
        }
      );

      const contentType = response.headers['content-type'];

      if(contentType.includes('application/json')) {
        setData(response.data);

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

  useEffect( () => {

    fetchPermissions();

  }, [])

  return {data, loading, error, fetchPermissions};

}

export default useFetchRolePermissions;