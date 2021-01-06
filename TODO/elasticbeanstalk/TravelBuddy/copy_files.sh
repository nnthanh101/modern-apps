if [ $# -eq 0 ]; then
    echo ""
    echo "-----------------------------------------------"
    echo "No arguments provided"
    echo "Please provide the target folder absolute path"
    echo "-----------------------------------------------"
    echo ""
    exit 1
fi

echo ""
echo "-----------------------------------------------"
echo "Copying new implementation to:"
echo "     $1"
echo "-----------------------------------------------"
echo ""

cp .ebextensions/* $1/.ebextensions/.
rm -rf $1/src/*
cp -r src/* $1/src
rm -rf $1/target
cp buildspec.yml $1/.
cp .gitignore $1/.
cp pom.xml $1/.
[ -f "$1/README.md" ] && rm "$1/README.md"
echo "     done!"
echo ""
echo ""
