import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';

export default function StatusIcon({ status }) {
  const theme = useTheme();
  if (status === 'success') {
    return (
      <>
        <Grid container justifyContent="center">
          <Grid item>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="75"
              height="75"
              viewBox="0 0 75 75">
              <g
                id="Group_6645"
                data-name="Group 6645"
                transform="translate(-144 -145)">
                <g
                  id="Ellipse_40"
                  data-name="Ellipse 40"
                  stroke="#43b02a"
                  strokeWidth="3px"
                  transform="translate(144 145)">
                  <circle stroke="none" cx="37.5" cy="37.5" r="37.5" />
                  <circle fill="#ffffff" cx="37.5" cy="37.5" r="36" />
                </g>
                <path
                  id="Path_310"
                  data-name="Path 310"
                  fill="#46ac2d"
                  d="M158.641,169.985a1.768,1.768,0,0,0-2.5,0l-15.608,15.607-8.216-8.216a1.767,1.767,0,1,0-2.5,2.5l9.466,9.465a1.767,1.767,0,0,0,2.5,0l16.857-16.857A1.767,1.767,0,0,0,158.641,169.985Z"
                  transform="translate(37.7 3.533)"
                />
              </g>
            </svg>
          </Grid>
          <Grid item xs={12}>
            <p
              style={{
                color: theme.palette.success.main,
                fontWeight: 700,
                fontSize: 24,
                textAlign: 'center'
              }}>
              Success
            </p>
          </Grid>
        </Grid>
      </>
    );
  }

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="66"
        height="76"
        viewBox="0 0 66 76">
        <g
          id="Group_6576"
          data-name="Group 6576"
          transform="translate(-138 -195)">
          <g
            id="Ellipse_417"
            data-name="Ellipse 417"
            transform="translate(138 201)"
            fill="none"
            stroke="#e31010"
            strokeWidth="3px">
            <circle cx="33" cy="33" r="33" stroke="none" />
            <circle cx="33" cy="33" r="31.5" fill="none" />
          </g>
          <text
            id="_"
            data-name="!"
            transform="translate(160 256)"
            fill="#e31010"
            fontSize="69"
            fontFamily="MshtakanBold, Mshtakan">
            <tspan x="0" y="0">
              !
            </tspan>
          </text>
        </g>
      </svg>
      <Grid container justifyContent="center">
        <p style={{ color: theme.palette.error.main }}>
          <b>Error</b>
        </p>
      </Grid>
    </>
  );
}
