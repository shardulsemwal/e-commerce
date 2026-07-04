import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react'

const List = () => {

  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      setList(response.data.products || []);
      console.log(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
  }
}

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div>
      
    </div>
  )
}

export default List
