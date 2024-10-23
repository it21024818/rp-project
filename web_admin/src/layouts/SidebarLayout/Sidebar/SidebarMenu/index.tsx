import { useContext } from 'react';

import {
  ListSubheader,
  alpha,
  Box,
  List,
  styled,
  Button,
  ListItem
} from '@mui/material';
import { NavLink as RouterLink } from 'react-router-dom';
import { SidebarContext } from 'src/contexts/SidebarContext';

import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone';
import Dashboard from '@mui/icons-material/Dashboard';
import BatchPrediction from '@mui/icons-material/BatchPrediction';
import BList from '@mui/icons-material/List';
import Feedback from '@mui/icons-material/Feedback';
import People from '@mui/icons-material/People';
import Newspaper from '@mui/icons-material/Newspaper';
import Man from '@mui/icons-material/Man';
import Repo from '@mui/icons-material/Report';

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.colors.alpha.trueWhite[50]};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: ${theme.colors.alpha.trueWhite[70]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.trueWhite[30]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[50]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.active,
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            color: ${theme.colors.alpha.trueWhite[100]};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create([
                  'transform',
                  'opacity'
                ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`
);

function SidebarMenu() {
  const { closeSidebar } = useContext(SidebarContext);

  return (
    <>
      <MenuWrapper>
        <List component="div">
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/admin/"
                  startIcon={<Dashboard />}
                >
                  Dashboard
                </Button>
              </ListItem>
            </List>
            <List
              component="div"
              subheader={
                <ListSubheader component="div" disableSticky>
                  Predictions
                </ListSubheader>
              }
            >
              <SubMenuWrapper>
                <List component="div">
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/admin/predictions/analytics"
                      startIcon={<BatchPrediction />}
                    >
                      Prediction Analytics
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/admin/predictions/list"
                      startIcon={<BList />}
                    >
                      Predictions List
                    </Button>
                  </ListItem>
                </List>
              </SubMenuWrapper>
            </List>
            <List
              component="div"
              subheader={
                <ListSubheader component="div" disableSticky>
                  Feedbacks
                </ListSubheader>
              }
            >
              <SubMenuWrapper>
                <List component="div">
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/admin/feedback/analytics"
                      startIcon={<Feedback />}
                    >
                      Feedback Analytics
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/admin/feedback/list"
                      startIcon={<BList />}
                    >
                      Feedback List
                    </Button>
                  </ListItem>
                </List>
              </SubMenuWrapper>
            </List>
            <List
              component="div"
              subheader={
                <ListSubheader component="div" disableSticky>
                  Users
                </ListSubheader>
              }
            >
              <SubMenuWrapper>
                <List component="div">
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/admin/users/list"
                      startIcon={<BList />}
                    >
                      Users List
                    </Button>
                  </ListItem>
                </List>
              </SubMenuWrapper>
            </List>
            <List
              component="div"
              subheader={
                <ListSubheader component="div" disableSticky>
                  News Sources
                </ListSubheader>
              }
            >
              <SubMenuWrapper>
                <List component="div">
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/admin/sources/list"
                      startIcon={<BList />}
                    >
                      News Sources List
                    </Button>
                  </ListItem>
                </List>
              </SubMenuWrapper>
            </List>
            <List
              component="div"
              subheader={
                <ListSubheader component="div" disableSticky>
                  Profile
                </ListSubheader>
              }
            >
              <SubMenuWrapper>
                <List component="div">
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/admin/profile"
                      startIcon={<Man />}
                    >
                      User Profile
                    </Button>
                  </ListItem>
                </List>
              </SubMenuWrapper>
            </List>
            <List
              component="div"
              subheader={
                <ListSubheader component="div" disableSticky>
                  Reports
                </ListSubheader>
              }
            >
              <SubMenuWrapper>
                <List component="div">
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/admin/reports"
                      startIcon={<Repo />}
                    >
                      System Reports
                    </Button>
                  </ListItem>
                </List>
              </SubMenuWrapper>
            </List>
          </SubMenuWrapper>
        </List>
      </MenuWrapper>
    </>
  );
}

export default SidebarMenu;
