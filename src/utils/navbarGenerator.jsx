

export const navbarGenerator = (items)=>{
    const navbarItem = items?.reduce((acc,item)=>{
        if(item.icon){
            acc.push({
                icon:item.icon,
                name:item.name,
                path:item.path,
            })
        }
        if(item?.name && item?.path){
            acc.push({
                key:item?.name,
                path:item?.path
            })
        }
        return acc
    },[])
    return navbarItem
}