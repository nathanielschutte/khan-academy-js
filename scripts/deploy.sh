BUCKET_URI="s3://jobsite-static"
BUCKET_PATH='kajs'
CLOUDFRONT_ID='ED1ZCNZBZX9SF'
aws s3 sync ./html/ $BUCKET_URI/$BUCKET_PATH --exclude "html/*.template"
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths /$BUCKET_PATH/*
