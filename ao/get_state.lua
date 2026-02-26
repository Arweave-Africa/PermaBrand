function get_state(base, req)
  local result = {}

  for i, kit in ipairs(base.brandkits) do
    result['brandkit_'..i..'_id'] = kit.id
    result['brandkit_'..i..'_name'] = kit.name
    result['brandkit_'..i..'_url'] = kit.url
    result['brandkit_'..i..'_description'] = kit.description
    result['brandkit_'..i..'_folder_id'] = kit.folderId
    result['brandkit_'..i..'_creator'] = kit.creator 
    result['brandkit_'..i..'_is_active'] = kit.is_active
  end

  return result
end