import { useMediaQuery } from '@chakra-ui/react';
import React from 'react';

const Calendar = () => {
    const [isLargerThan510] = useMediaQuery("(min-width: 510px)");
  
    return (
      <>
        <iframe
        src={`https://calendar.google.com/calendar/embed?wkst=1&
        title=IFrame_Calendar&bgcolor=%232c7a7b&ctz=Asia%2FKarachi&showTabs=1&showPrint=0&showCalendars=0&src=M2hjZWYxNnNrNnE3cG5uOGpsc2w4aGdwcnNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23F09300`}
        style={{
          border: "solid 2px #307",
          margin: "0 auto",
          marginTop:"15px",
          width: isLargerThan510 ? "62vw" : "90vw",
          height: isLargerThan510 ? "24vw" : "45vw",
        }}
        frameBorder="0"
        title='Calendar'
        scrolling="no"
      ></iframe>
      
      </>
    )
}

export default Calendar
