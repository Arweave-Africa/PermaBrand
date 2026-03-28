Brandkits = Brandkits or {}
-- Brandkit = {
   -- id,
   -- name 
   -- url 
   -- description
   -- folder_id
   -- creator
   -- is_active
--}

-- Sync once on process load
InitialSync = InitialSync or 'INCOMPLETE'
if InitialSync == 'INCOMPLETE' then
  Send({
    device = 'patch@1.0',
    brandkits = Brandkits
  })
  InitialSync = 'COMPLETE'
end

local function get_action(msg)
    local tags = msg.Tags or {}
    local action = tags.Action
    if action and action ~= "" then
        return action
    end
    return "unknown-action"
end

local function send_error(msg, errorMessage)
    Send({
        Target = msg.From,
        Action = get_action(msg) .. "-error",
        Error = errorMessage
    })
end

local function deriveUrl(name)
    return (name:gsub("%s+", "-"))
end

local function trim_string(value)
    if type(value) ~= "string" then
        return nil
    end

    return value:match("^%s*(.-)%s*$")
end

local function normalize_optional_string(value)
    value = trim_string(value)
    if value == nil or value == "" then
        return nil
    end
    return value
end

local function parse_optional_status(value)
    if value == nil or value == "" then
        return nil
    end

    if value == "true" then
        return true
    end

    if value == "false" then
        return false
    end

    return nil, "Invalid status"
end

local function find_brandkit_index_by_id(id)
    for i, brandkit in ipairs(Brandkits) do
        if brandkit.id == id then
            return i
        end
    end
    return nil
end

local function brandkit_exists_by_name(name)
    for _, brandkit in ipairs(Brandkits) do
        if brandkit.name == name then
            return true
        end
    end
    return false
end

Handlers.add("add-brandkit", "add-brandkit", function(msg)
    local tags = msg.Tags or {}
    local name = normalize_optional_string(tags.Name)
    local description = tags.Description or ""
    local folder_id = normalize_optional_string(tags["Arweave-Manifest-Id"])

    if not name or #name <= 1 then
        send_error(msg, "Name too short")
        return
    end

    if not folder_id or #folder_id ~= 43 then
        send_error(msg, "Invalid Arweave-Manifest-Id")
        return
    end

    local normalizedName = name:lower()
    local url = deriveUrl(normalizedName)

    if brandkit_exists_by_name(normalizedName) then
        send_error(msg, "Brandkit already exists")
        return
    end

    local brandkit = {
        id = msg.Id,
        name = normalizedName,
        url = url,
        description = description,
        folderId = folder_id,
        creator = msg.From,
        is_active = true
    }

    Brandkits[#Brandkits+1] = brandkit

    Send({
      device = 'patch@1.0',
      brandkits = Brandkits
    })
end)

Handlers.add("update-brandkit", "update-brandkit", function(msg)
    local tags = msg.Tags or {}
    local brandkitId = trim_string(tags["Brandkit-Id"]) or ""
    local incomingName = tags.Name
    local incomingDescription = tags.Description
    local incomingFolderId = tags["Arweave-Manifest-Id"]

    if brandkitId == "" then
        send_error(msg, "Brandkit-Id is required")
        return
    end

    local index = find_brandkit_index_by_id(brandkitId)
    if not index then
        send_error(msg, "Brandkit not found")
        return
    end

    local brandkit = Brandkits[index]

    if not brandkit then 
        send_error(msg, "Brandkit not found")
        return
    end

    if brandkit.creator ~= msg.From then
        send_error(msg, "Not authorized to update this brandkit")
        return
    end

    local normalizedIncomingName = normalize_optional_string(incomingName)
    local normalizedIcomingDescription = normalize_optional_string(incomingDescription)
    local normalizedIncomingFolderId = normalize_optional_string(incomingFolderId)
    local incomingActivityStatus, statusError = parse_optional_status(tags["Brandkit-Status"])

    if normalizedIncomingName and #normalizedIncomingName <= 1 then
        send_error(msg, "Name too short")
        return
    end

    if normalizedIncomingFolderId and #normalizedIncomingFolderId ~= 43 then
        send_error(msg, "Invalid Arweave-Manifest-Id")
        return
    end

    if statusError then
        send_error(msg, statusError)
        return
    end

    local nextName = normalizedIncomingName and normalizedIncomingName:lower() or brandkit.name
    local nextDescription = brandkit.description
    if normalizedIcomingDescription ~= nil then
        nextDescription = normalizedIcomingDescription
    end
    local nextFolderId = normalizedIncomingFolderId and normalizedIncomingFolderId or brandkit.folderId
    local nextStatus = incomingActivityStatus
    if nextStatus == nil then
        nextStatus = brandkit.is_active
    end

    Brandkits[index] = {
        id = brandkit.id,
        name = nextName,
        url = deriveUrl(nextName),
        description = nextDescription,
        folderId = nextFolderId,
        creator = brandkit.creator,
        is_active = nextStatus
    }

    Send({
      device = 'patch@1.0',
      brandkits = Brandkits
    })
end)
