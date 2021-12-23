import useSWR from "swr";

function useGetEvent(startTime, endTime, filter) {
  let query = "/events/all2";
 
  if (endTime && filter === true) {
    query = `/events/all2?endTime=${endTime}`;
  }
  if(startTime && endTime && filter === true){
    query = `/events/all2?startTime=${startTime}&endTime=${endTime}`;

  }
 
  const { data, isValidating, mutate,...rest } = useSWR(query);
  return {
    data,mutate,
    isValidating,
    rest,
    nextToken: data?.nextPageToken || false,
  };
}
export default useGetEvent;
