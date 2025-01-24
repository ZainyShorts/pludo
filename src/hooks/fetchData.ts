import useSWR from 'swr';

const useFetchData = (url : string) => {
    const fetcher = (url : string) => fetch(url).then((res) => res.json());
    const { data, error } = useSWR(url, fetcher, {
      revalidateOnFocus: false,  
    });
  
    return { data, error };
  };
  

export default useFetchData;
