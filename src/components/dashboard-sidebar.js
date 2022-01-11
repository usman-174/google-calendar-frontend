import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ClosedCaptionOffIcon from '@mui/icons-material/ClosedCaptionOff';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import StarsIcon from '@mui/icons-material/Stars';
import TextsmsIcon from '@mui/icons-material/Textsms';
import { Box, Divider, Drawer, Typography, useMediaQuery } from "@mui/material";
import NextLink from "next/link";
import EventNoteSharpIcon from '@mui/icons-material/EventNoteSharp';
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { Logo } from "./logo";
import { NavItem } from "./nav-item";
const items = [
  {
    href: "/",
    icon: <CalendarTodayIcon fontSize="small" />,
    title: "Calendar",
  },
  {
    href: "/reminders",
    icon: <TextsmsIcon fontSize="small" />,
    title: "Reminders",
  },
  {
    href: "/events",
    icon: <LocalActivityIcon fontSize="small" />,
    title: "Events",
  },
  {
    href: "/feedback",
    icon: <StarsIcon fontSize="small" />,
    title: "FeedBack",
  },
  {
    href: "/templates",
    icon: <ClosedCaptionOffIcon fontSize="small" />,
    title: "Templates",
  },
  // {
  //   href: "/register",
  //   icon: <UserAddIcon fontSize="small" />,
  //   title: "Register",
  // },
  // {
  //   href: "/404",
  //   icon: <XCircleIcon fontSize="small" />,
  //   title: "Error",
  // },
];

export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
    defaultMatches: true,
    noSsr: false,
  });

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  const content = (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div>
          <Box sx={{ p: 4, display: "flex", alignItems: "center",justifyContent:"space-around" }}>
            <NextLink href="/" passHref>
              <a>
                <EventNoteSharpIcon
                  sx={{
                    height: 42,
                    color:"#10B981",
                    width: 42,
                  }}
                />
              </a>
            </NextLink>
            <Typography variant="h6" component="h6">
              IFRAME CALENDAR
            </Typography>
          </Box>
        </div>
        <Divider
          sx={{
            borderColor: "#2D3748",
            my: 3,
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {items.map((item) => (
            <NavItem key={item.title} icon={item.icon} href={item.href} title={item.title} />
          ))}
        </Box>
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.900",
            color: "#FFFFFF",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.900",
          color: "#FFFFFF",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
