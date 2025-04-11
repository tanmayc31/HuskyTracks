import React, { MouseEvent as ReactMouseEvent, useCallback } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Button, Grid, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const HeroSpotlight = ({ userEmail }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const navigate = useNavigate();

    const particlesInit = useCallback(async (engine) => {
        await loadFull(engine);
    }, []);

    const handleMouseMove = (event) => {
        const { currentTarget, clientX, clientY } = event;
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    const background = useMotionTemplate`radial-gradient(650px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.07), transparent 80%)`;
    const userName = userEmail?.split("@")[0];

    return (
        <Box
            onMouseMove={handleMouseMove}
            sx={{
                position: "relative",
                backgroundColor: "#0f0f0f",
                borderRadius: "16px",
                py: 12,
                px: { xs: 3, md: 5 },
                mb: 5,
                color: "#E2E8F0",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                overflow: "hidden",
            }}
        >
            {/* Subtle Star Particles */}
            <Particles
                id="tsparticles"
                init={particlesInit}
                options={{
                    fullScreen: { enable: false },
                    background: { color: "transparent" },
                    particles: {
                        number: { value: 12 },
                        color: { value: "#ffffff" },
                        opacity: { value: 0.2 },
                        size: { value: 1.5 },
                        move: {
                            enable: true,
                            speed: 0.08,
                            direction: "none",
                            outModes: { default: "out" },
                        },
                        links: { enable: false },
                    },
                    interactivity: {
                        events: {
                            onHover: { enable: true, mode: "attract" },
                            onClick: { enable: false },
                        },
                        modes: {
                            attract: {
                                distance: 80,
                                duration: 0.8,
                                speed: 0.3,
                            },
                        },
                    },
                }}
                style={{
                    position: "absolute",
                    zIndex: 0,
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
            />

            {/* Spotlight Glow */}
            <motion.div
                style={{
                    pointerEvents: "none",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: "16px",
                    opacity: 0.5,
                    background,
                    transition: "opacity 0.3s ease",
                }}
            />

            {/* Content Layout */}
            <Grid
                container
                alignItems="center"
                spacing={4}
                zIndex={1}
                position="relative"
                justifyContent="space-between"
            >
                {/* Left Text Section */}
                <Grid item xs={12} md={7}>
                    <Typography
                        variant="h3"
                        sx={{ fontWeight: 700, color: "#c1121f", fontSize: "2.85rem" }}
                    >
                        Welcome, {userName}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            mt: 2,
                            fontSize: "1.1rem",
                            color: "#d1d5db",
                            maxWidth: "100%",
                            lineHeight: 1.7,
                        }}
                    >
                        Track and recover your lost items across campus easily with HuskyTracks.
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            mt: 1,
                            fontSize: "1.1rem",
                            color: "#d1d5db",
                            maxWidth: "100%",
                            lineHeight: 1.7,
                        }}
                    >
                        We're here to help you stay calm and connected.
                    </Typography>
                </Grid>

                {/* Right Button Section */}
                <Grid
                    item
                    xs={12}
                    md={5}
                    sx={{
                        display: "flex",
                        justifyContent: { xs: "center", md: "flex-end" },
                        alignItems: "center",
                        mt: { xs: 3, md: 0 },
                        pr: { md: 10 },
                    }}
                >
                    <Box>
                        <Button
                            onClick={() => navigate("/report-lost-item")}
                            variant="contained"
                            sx={{
                                backgroundColor: "#c1121f",
                                color: "#fff",
                                fontWeight: 600,
                                textTransform: "none",
                                px: 4,
                                py: 1.6,
                                borderRadius: "8px",
                                fontSize: "1rem",
                                minWidth: "220px",
                                zIndex: 1,
                                position: "relative",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                "&:hover": {
                                    backgroundColor: "#dc2626",
                                },
                            }}
                        >
                            Report a Lost Item
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default HeroSpotlight;