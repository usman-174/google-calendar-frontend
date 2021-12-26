import useSWR from "swr";

function useGetEvent(startTime, endTime, filter,searchQuery) {
  let query = "/events/all";
 
  if (endTime && filter === true) {
    query = `/events/all?endTime=${endTime}`;
  }
  if(startTime && endTime && filter === true){
    query = `/events/all?startTime=${startTime}&endTime=${endTime}`;

  }
  if(searchQuery.length && !filter){
    query = `/events/all?query=${searchQuery}`;
  }
 
  const { data, isValidating,error, mutate,...rest } = useSWR(query);
  return {
    data,mutate,
    isValidating,error,
    rest,
    nextToken: data?.nextPageToken || false,
  };
}
export default useGetEvent;
