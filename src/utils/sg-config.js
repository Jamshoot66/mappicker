var smartgrid = require('smart-grid');
 
let settings = {
    outputStyle: 'scss', 
    columns: 12,
    offset: '30px', 
    mobileFirst: false, 
    container: {
        maxWidth: '1200px', 
        fields: '30px' 
    },
    breakPoints: {
        lg: {
            width: '1100px', 
        },
        md: {
            width: '960px'
        },
        sm: {
            width: '780px',
            fields: '15px' 
        },
        xs: {
            width: '560px'
        }
    }
};
 
smartgrid('./src/utils/', settings);