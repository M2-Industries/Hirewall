import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchTerm } from '../slice';
import type { HireWallState } from '../slice';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '50vw',
    },
  },
}));

export default function SearchBar() {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state: HireWallState) => state.searchTerm);
  return (
    <div className='searchContainer'>
      <Search>
        <SearchIconWrapper>
          <SearchIcon
            sx={{
              fontSize: '1.5rem',
            }}
          />
        </SearchIconWrapper>
        <StyledInputBase
          sx={{
            fontSize: '1.5rem',
          }}
          className='searchBar'
          placeholder='Search…'
          value={searchTerm}
          inputProps={{ 'aria-label': 'search' }}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            dispatch(setSearchTerm(e.target.value))
          }
        />
      </Search>
    </div>
  );
}
