import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import { useSpring, animated } from "@react-spring/web";
import { Paper, ThemeProvider, Typography } from "@mui/material";
import { violet_theme } from "../../theme/AppThemes";
import CustomerChatView from "./CustomerChatView";

const Fade = React.forwardRef(function Fade(props, ref) {
  const { in: open, children, onEnter, onExited, ...other } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element,
  in: PropTypes.bool,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
};

export default function ChatPopper({
  anchorEl,
  setAnchorEl,
  open,
  setOpen,
  converRef,
  user,
  roomStateRef,
}) {
  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? "spring-popper" : undefined;

  return (
    <ThemeProvider theme={violet_theme}>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        transition
        placement="top-end"
        sx={{zIndex: 5}}//above like and info button in product card
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Paper
              elevation={5}
              sx={{
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              <CustomerChatView
                converRef={converRef}
                user={user}
                roomStateRef={roomStateRef}
              />
            </Paper>
          </Fade>
        )}
      </Popper>
    </ThemeProvider>
  );
}
