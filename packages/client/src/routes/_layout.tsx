import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { css } from "../../styled-system/css";
import { Box, Divider, HStack } from "../../styled-system/jsx";
import logo from "../assets/logo.svg";

export const Route = createRootRoute({
    component: () => (
        <>
            <Box
                className={css({
                    pos: "sticky",
                    top: 0,
                    bgColor: "white",
                    zIndex: 100,
                    px: 3,
                })}
            >
                <HStack gap={3} justify="space-between">
                    <Link to="/">
                        <img
                            src={logo}
                            alt="Commenter"
                            className={css({ height: 12 })}
                        />
                    </Link>
                    <HStack gap={3} className={css({ padding: 3 })}>
                        <Link to="/">Home</Link>
                        <Link to="/about">About</Link>
                    </HStack>
                </HStack>
                <Divider orientation="horizontal" />
            </Box>
            <Box className={css({ p: 3 })}>
                <Outlet />
            </Box>
        </>
    ),
});
