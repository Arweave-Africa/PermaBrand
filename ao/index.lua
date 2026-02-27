Brandkits = Brandkits or {} -- Brandkit = { id, name, url, description, folderId, creator, is_active } }

-- Sync once on process load
InitialSync = InitialSync or 'INCOMPLETE'
if InitialSync == 'INCOMPLETE' then
  Send({
    device = 'patch@1.0',
    brandkits = Brandkits
  })
  InitialSync = 'COMPLETE'
end

local function getAction(msg)
    local tags = msg.Tags or {}
    local action = tags.Action
    if action and action ~= "" then
        return action
    end
    return "unknown-action"
end

local function sendError(msg, errorMessage)
    Send({
        Target = msg.From,
        Action = getAction(msg) .. "-error",
        Error = errorMessage
    })
end

local function deriveUrl(name)
    return (name:gsub("%s+", "-"))
end

local function findBrandkitIndexById(id)
    for i, brandkit in ipairs(Brandkits) do
        if brandkit.id == id then
            return i
        end
    end
    return nil
end

Handlers.add("add-brandkit", "add-brandkit", function(msg)
    local tags = msg.Tags or {}
    local name = (tags.Name or ""):lower()
    local description = tags.Description or ""
    local folder_id = tags["Arweave-Manifest-Id"] or ""

    if #name <= 1 then
        sendError(msg, "Name too short")
        return
    end

    if #folder_id ~= 43 then
        sendError(msg, "Invalid Arweave-Manifest-Id")
        return
    end

    local brandkit = {
        id = msg.Id,
        name = name,
        url = deriveUrl(name),
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

-- Handlers.add("get-brandkit", "get-brandkit", function(msg)
--     local tags = msg.Tags or {}
--     local name = tags.Name or ""
--     if not name or name == "" then
--         sendError(msg, "Name is required")
--         return
--     end

--     local brandkit = Brandkits[name]
--     if not brandkit then
--         sendError(msg, "Brandkit not found")
--         return
--     end 

--     Send({
--         Target = msg.From,
--         Action = getAction(msg) .. "-response",
--         Data = json.encode(brandkit)
--     })
-- end)

Handlers.add("update-brandkit", "update-brandkit", function(msg)
    local tags = msg.Tags or {}
    local brandkitId = tags["Brandkit-Id"] or ""

    if brandkitId == "" then
        sendError(msg, "Brandkit-Id is required")
        return
    end

    local index = findBrandkitIndexById(brandkitId)
    if not index then
        sendError(msg, "Brandkit not found")
        return
    end

    local brandkit = Brandkits[index]
    if brandkit.creator ~= msg.From then
        sendError(msg, "Not authorized to update this brandkit")
        return
    end

    local incomingName = tags.Name
    local incomingDescription = tags.Description
    local incomingFolderId = tags["Arweave-Manifest-Id"]

    if incomingName and incomingName ~= "" and #incomingName <= 1 then
        sendError(msg, "Name too short")
        return
    end

    if incomingFolderId and incomingFolderId ~= "" and #incomingFolderId ~= 43 then
        sendError(msg, "Invalid Arweave-Manifest-Id")
        return
    end

    local nextName = incomingName and incomingName:lower() or brandkit.name
    local nextDescription = incomingDescription or brandkit.description
    local nextFolderId = incomingFolderId or brandkit.folderId

    Brandkits[index] = {
        id = brandkit.id,
        name = nextName,
        url = deriveUrl(nextName),
        description = nextDescription,
        folderId = nextFolderId,
        creator = brandkit.creator,
        is_active = brandkit.is_active
    }

    Send({
      device = 'patch@1.0',
      brandkits = Brandkits
    })
end)
