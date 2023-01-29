import { Box } from '@mui/material';
import { styled } from '@mui/system';

// custom mui component with custom css properities, this allows to use these css properties in many areas
const FlexBetween = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export default FlexBetween;
