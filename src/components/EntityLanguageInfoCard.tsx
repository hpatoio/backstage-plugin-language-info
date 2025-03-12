import {
  useEntity,
} from '@backstage/plugin-catalog-react';
import {
  AboutField
} from '@backstage/plugin-catalog';


import React from 'react';

import { Card, CardHeader, CardContent, Divider, Grid } from '@material-ui/core';


/**
 * Card for the catalog (entity page) that shows the language info
 *
 * @public
 */
export const EntityLanguageInfoCard = () => {

  const { entity } = useEntity();
   
  return (
    <Card className="gridItemCard">
      <CardHeader
        title='Language Info'
      />
      <Divider />
      <CardContent className="gridItemCardContent">
        <Grid container>
          <AboutField
            label='Language'
            value={entity.metadata.annotations?.["language-info/name"]}
            gridSizes={{ xs: 12, sm: 6, lg: 4 }}
          />
          <AboutField
            label='Version'
            value={entity.metadata.annotations?.["language-info/version"]}
            gridSizes={{ xs: 12, sm: 6, lg: 4 }}
          />
        </Grid>
      </CardContent>
    </Card>
  );
};