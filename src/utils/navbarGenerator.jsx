

export const navbarGenerator = (items)=>{
    const navbarItem = items?.reduce((acc,item)=>{
        if(item.icon){
            acc.push({
                icon:item.icon,
                name:item.name,
                path:item.path,
            })
        }else if(item?.name && item?.path){
            acc.push({
                name:item?.name,
                path:item?.path
            })
        }
        return acc
    },[])
    return navbarItem
}