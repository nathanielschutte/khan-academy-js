BUCKET_URI="s3://jobsite-static"
BUCKET_PATH='kajs'
CLOUDFRONT_ID='ED1ZCNZBZX9SF'
BASE_URL='https:\/\/site.coderotate.net\/'$BUCKET_PATH
sed -i "s/http:\/\/localhost:3000/$BASE_URL/g" ./html/projects/*.html
aws s3 sync ./html/ $BUCKET_URI/$BUCKET_PATH --exclude "html/*.template"
sed -i "s/$BASE_URL/http:\/\/localhost:3000/g" ./html/projects/*.html
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths /$BUCKET_PATH/*
