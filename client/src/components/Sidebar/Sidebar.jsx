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

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

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

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

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

export default function Sidebar( {onLoopIconClick} ) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    // Info Popup
    const [infoPopoverOpen, setInfoPopoverOpen] = React.useState(false);
    const [infoAnchorEl, setInfoAnchorEl] = React.useState(null);

    const handleInfoPopoverOpen = (event) => {
        setInfoAnchorEl(event.currentTarget);
        setInfoPopoverOpen(true);
    };

    const handleInfoPopoverClose = () => {
        setInfoAnchorEl(null);
        setInfoPopoverOpen(false);
    };

    // Copyright Popup
    const [popoverOpen, setPopoverOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setPopoverOpen(true);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setPopoverOpen(false);
    };

    // Dark mode
    const [darkMode, setDarkMode] = React.useState(false);

    const appTheme = createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
      },
    });

    // Clock
    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Carousel toggle
    const [isCarouselActive, setIsCarouselActive] = useState(false);
    const toggleCarousel = () => {
        setIsCarouselActive((prevState) => !prevState);
    };

    return (
        <ThemeProvider theme={appTheme}>
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <Map darkMode={darkMode} isCarouselActive={isCarouselActive}/>
            <AppBar position="absolute" open={open} darkMode={darkMode}>
                <Toolbar>
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
                            onClick={onLoopIconClick}
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
                                    color: isCarouselActive ? '#8F00E3' : undefined, // Add this line
                                }}
                                onClick={toggleCarousel}
                            >
                                <ViewCarouselIcon />
                            </ListItemIcon>

                            <ListItemText primary="Karusellmodus" sx={{opacity: open ? 1 : 0}} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key="Dark/light mode" disablePadding sx={{display: 'block'}}>
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
                            <ListItemText primary="Mørk/lys modus" sx={{opacity: open ? 1 : 0}} />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider/>
                <List>
                    {['Informasjon', 'Opphavsrett'].map((text, index) => (
                        <ListItem key={text} disablePadding sx={{display: 'block'}}>
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
                        </ListItem>
                    ))}
                </List>
                <Divider/>
                <List>
                  <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <ListItemText
                      secondaryTypographyProps={{ sx: { fontSize: 11 } }}
                      primary={currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
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
                        <Typography variant="body1">
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
                        <Typography variant="body1">
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