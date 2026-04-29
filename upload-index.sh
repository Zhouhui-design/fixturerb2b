#!/bin/bash
echo "Uploading index.html to server..."
scp -o PreferredAuthentications=password /home/sardenesy/fixturerb2b/dist/index.html sardenesy@fixturerb2b.top:/usr/share/nginx/html/index.html
if [ $? -eq 0 ]; then
    echo "✅ Upload successful!"
else
    echo "❌ Upload failed. Try Method 1 (FileZilla) or Method 3 (SSH)"
fi
