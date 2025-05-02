import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea } from '@mui/material';

export default function About() {
  return (
    <Box sx={{textAlign:'center'}}>
        <h2 className='aboutusheading'>ABOUT US</h2>
    <Box
    sx={{alignItems:'center',
    display: 'inline-flex',
    flexDirection: 'row',
    flexWrap:'wrap',
    alignContent: 'center',
    justifyContent: 'center',
    width:'100%'
    }}
    >
    <Card sx={{ maxWidth: 345,m:2 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="180"
          image="developer.jpg"
          alt="Sahil_Singh"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            SOURAV VERMA
          </Typography>
          <Typography variant="body2" color="text.secondary">
          Computer Science Engineer <br />
            <em>Email : </em>sourav7889509712@gmail.com <br />
            <em>Address : </em>RR nagar, bengaluru, 560098 <br />
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    <Card sx={{ maxWidth: 345,m:2 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="180"
          image="developer.jpg"
          alt="Vishal_Maurya"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            VIVEK KHAJURIA
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Computer Science Engineer <br/>
          <em>Email : </em>vivekkhajuria1187@gmail.com <br />
          <em>Address : </em>gugugram, sector-36A <br />
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    <Card sx={{ maxWidth: 345,m:2 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="180"
          image="developer.jpg"
          alt="Amit_Soni"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            VIKAS RAMESHWAR KUMHAR
          </Typography>
          <Typography variant="body2" color="text.secondary">
          Computer Science Engineer <br />
          <em>Email : </em>vikas786@gmail.com <br />
          <em>Address : </em>Bannerghata, bengaluru <br />

          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    </Box>
    </Box>
  );
}
