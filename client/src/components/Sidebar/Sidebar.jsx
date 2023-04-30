/* eslint-disable react/prop-types */
import * as React from 'react';
import {styled, useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import InfoIcon from '@mui/icons-material/Info';
import CopyrightIcon from '@mui/icons-material/Copyright';
import DarkModeTwoToneIcon from '@mui/icons-material/DarkModeTwoTone';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Popover from '@mui/material/Popover';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Map from "../Map/Map.jsx";
import { useState, useEffect } from 'react';
import {Tooltip} from "@mui/material";

const drawerWidth = 240;

// Defines a mixin function named `openedMixin` that takes a theme object as its argument
const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

// Defines a mixin function named `closedMixin` that takes a theme object as its argument
const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

// Defines a styled component named `DrawerHeader` using the `styled` function from the Material-UI library
const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

// Defines a styled component named `AppBar` by extending the `MuiAppBar` component from the Material-UI library
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open' && prop !== 'darkMode',
})(({theme, open, darkMode}) => ({
    background: darkMode
      ? `linear-gradient(to right, #8F00E3, #5A0196)` // Color of the navbar when in dark mode
      : `linear-gradient(to right, #8F00E3, #5A0196)`,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

// Defines a styled component named `Drawer` by extending the `MuiDrawer` component from the Material-UI library
const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

// Sidebar component that appears on the left-hand side of the application
export default function Sidebar() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [infoPopoverOpen, setInfoPopoverOpen] = React.useState(false); // Info popup
    const [infoAnchorEl, setInfoAnchorEl] = React.useState(null); // Info popup
    const [popoverOpen, setPopoverOpen] = React.useState(false); // Copyright popup
    const [anchorEl, setAnchorEl] = React.useState(null); // Copyright popup
    const [darkMode, setDarkMode] = React.useState(false); // Dark mode
    const [currentTime, setCurrentTime] = useState(new Date()); // Clock
    const [isCarouselActive, setIsCarouselActive] = useState(false); // Carousel toggle

    // Functions to handle opening and closing of the drawer
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    // Functions to handle opening and closing of the info popover
    const handleInfoPopoverOpen = (event) => {
        setInfoAnchorEl(event.currentTarget);
        setInfoPopoverOpen(true);
    };
    const handleInfoPopoverClose = () => {
        setInfoAnchorEl(null);
        setInfoPopoverOpen(false);
    };

    // Functions to handle opening and closing of the copyright popover
    const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setPopoverOpen(true);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
        setPopoverOpen(false);
    };

    // Function to toggle the carousel mode
    const toggleCarousel = () => {
        setIsCarouselActive((prevState) => !prevState);
    };

    // Effect hook to update the current time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Defined a theme using createTheme function and current value of darkMode state
    const appTheme = createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
      },
    });

    // Return JSX expression that renders Sidebar component
    return (
        <ThemeProvider theme={appTheme}>
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <Map darkMode={darkMode} isCarouselActive={isCarouselActive}/>
            <AppBar position="absolute" open={open} darkMode={darkMode}>
                <Toolbar>
                    <Tooltip title="Åpne meny" arrow>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                marginRight: 5,
                                ...(open && {display: 'none'}),
                            }}
                        >
                            <MenuIcon/>
                        </IconButton>
                    </Tooltip>
                    <Typography variant="h6" noWrap component="div">
                        Marine Traffic Portal
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                    </IconButton>
                </DrawerHeader>
                <Divider/>
                <List>
                    <ListItem key="Marine tracking" disablePadding sx={{display: 'block'}}>
                        <ListItemButton
                            onClick={toggleCarousel}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                    color: isCarouselActive ? '#8F00E3' : undefined,
                                }}
                            >
                                <Tooltip title="Slå på karusellmodus">
                                    <ViewCarouselIcon />
                                </Tooltip>
                            </ListItemIcon>

                            <ListItemText primary="Karusellmodus" sx={{opacity: open ? 1 : 0}} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key="Dark/light mode" disablePadding sx={{display: 'block'}}>
                        <Tooltip title="Veksle mellom mørk/lys modus" arrow>
                            <ListItemButton
                                onClick={() => setDarkMode(!darkMode)}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {darkMode ? <WbSunnyIcon /> : <DarkModeTwoToneIcon />}
                                </ListItemIcon>
                                <ListItemText primary="Mørk/Lys modus" sx={{opacity: open ? 1 : 0}} />
                            </ListItemButton>
                        </Tooltip>
                    </ListItem>
                </List>
                <Divider/>
                <List>
                    {['Informasjon', 'Opphavsrett'].map((text, index) => (
                        <ListItem key={text} disablePadding sx={{display: 'block'}}>
                            <Tooltip title={text === "Informasjon" ? "Vis informasjon" : "Vis opphavsrett"} arrow>
                                <ListItemButton
                                    onClick={index % 2 === 0 ? handleInfoPopoverOpen : handlePopoverOpen}
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {index % 2 === 0 ? <InfoIcon/> : <CopyrightIcon/>}
                                    </ListItemIcon>
                                    <ListItemText secondary={text} sx={{
                                        opacity: open ? 1 : 0}}/>
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    ))}
                </List>
                <Divider/>
                <List>
                  <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <ListItemText
                        secondaryTypographyProps={{ sx: { fontSize: 11 } }}
                        primary={new Intl.DateTimeFormat('nb-NO', { hour: '2-digit', minute: '2-digit', hour12: false }).format(currentTime)}
                        secondary={currentTime.toLocaleDateString('nb-NO', { month: 'long', day: 'numeric' })}
                        sx={{
                          opacity: open ? 1 : 1,
                          color: (theme) => theme.palette.text.secondary,
                          textAlign: 'center',
                        }}
                      />
                    </ListItem>
                </List>
            </Drawer>
                <Popover
                    open={infoPopoverOpen}
                    anchorEl={infoAnchorEl}
                    onClose={handleInfoPopoverClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: open ? 'left' : 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Box sx={{
                        p: 2,
                        width: '300px',
                        height: 'auto',
                    }}>
                        <Typography variant="body1" component={'span'}>
                            <p style={{
                                fontSize: "18px",
                                fontWeight: "bold",
                            }}>
                                Informasjon
                            </p>
                            <p style={{
                                fontSize: "14px",
                            }}>
                                Denne maritime trafikkportalen gir sanntidssporing og visualisering av sjøtrafikk. Dataene som brukes i denne portalen kommer fra ulike kilder, inkludert AIS-dataleverandører, satellittsporing og havnemyndigheter. Vær oppmerksom på at nøyaktigheten og påliteligheten til informasjonen som gis kan variere avhengig av datakilden.
                            </p>
                        </Typography>
                    </Box>
                </Popover>

                <Popover
                    open={popoverOpen}
                    anchorEl={anchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: open ? 'left' : 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Box sx={{
                        p: 2,
                        width: '300px',
                        height: 'auto',
                    }}>
                        <Typography variant="body1" component={'span'}>
                            <p style={{
                                fontSize: "18px",
                                fontWeight: "bold",
                            }}>
                                Copyright © 2023 Martin Stene, André Gärtner, Accenture og NTNU. Alle rettigheter forbeholdt.
                            </p>
                            <p style={{
                                fontSize: "14px",
                            }}>
                                Denne nettapplikasjonen, inkludert design, kode, funksjonalitet og innhold, er den eksklusive eiendommen til Martin Stene, André Gärtner, Accenture og Norges teknisk-naturvitenskapelige universitet (NTNU). Uautorisert kopiering, reproduksjon, distribusjon, modifikasjon, visning eller bruk av noen del av denne nettapplikasjonen er strengt forbudt uten uttrykkelig skriftlig samtykke fra opphavsrettsinnehaverne.
                            </p>
                        </Typography>
                    </Box>
                </Popover>

        </Box>
        </ThemeProvider>
    );
}