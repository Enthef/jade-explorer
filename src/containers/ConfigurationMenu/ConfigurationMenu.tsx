import * as React from "react";
import { IconButton, Menu, MenuItem, ListItemText, ListItemSecondaryAction, Input, ListItemIcon, Tooltip } from "@material-ui/core"; //tslint:disable-line
import { NavigateNext, NavigateBefore } from "@material-ui/icons";
import SettingsIcon from "@material-ui/icons/Settings";

interface IConfigurationMenuProps {
  onChange: (type: string, url: string) => any;
}

interface IPagedMenuProps {
  onChange: (type: string, url: string) => any;
}

const PagedMenu: React.FC<IPagedMenuProps> = (props) => {
  const [selected, setSelected] = React.useState<"service-runner" | "ethereum-rpc" | null>(null);
  const nameMap = {
    "service-runner": "Service Runner RPC",
    "ethereum-rpc": "Ethereum RPC",
  };

  if (selected) {
    return (
      <>
        <MenuItem onClick={() => setSelected(null)}>
          <ListItemIcon>
            <NavigateBefore />
          </ListItemIcon>
          <ListItemText>
            Back
          </ListItemText>
        </MenuItem>
        <Input
          onChange={(e) => props.onChange(selected, e.currentTarget.value)}
          placeholder={`${nameMap[selected]} Url`}
          fullWidth={true}
        />
      </>
    );
  }

  return (
    <>
      <MenuItem onClick={() => setSelected("service-runner")}>
        <ListItemText>
          Service Runner RPC
          </ListItemText>
        <ListItemSecondaryAction>
          <NavigateNext />
        </ListItemSecondaryAction>
      </MenuItem>
      <MenuItem onClick={() => setSelected("ethereum-rpc")}>
        <ListItemText>
          Ethereum RPC
          </ListItemText>
        <ListItemSecondaryAction>
          <NavigateNext />
        </ListItemSecondaryAction>
      </MenuItem>
    </>
  );

};

const ConfigurationMenu: React.FC<IConfigurationMenuProps> = (props) => {
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const open = !!anchorEl;

  function handleMenu(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <Tooltip title="Configuration">
        <IconButton
          aria-label="Configuration"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <SettingsIcon color="action"/>
        </IconButton>
      </Tooltip>
      <Menu
        id="menu-appbar"
        getContentAnchorEl={null}
        anchorEl={anchorEl}
        keepMounted
        open={open}
        PaperProps={{
          style: {
            width: "250px",
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={handleClose}
      >
        <PagedMenu onChange={props.onChange}></PagedMenu>
      </Menu>
    </>
  );
};

export default ConfigurationMenu;
