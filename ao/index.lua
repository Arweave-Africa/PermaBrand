local json = require("json")

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
        Send({
            Target = msg.From,
            Action = getAction(msg) .. "-error",
            Data = json.encode(msg)
        })
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

-- Handlers.add("update-brandkit", "update-brandkit", function(msg)
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

--     if brandkit.creator ~= msg.From then
--         sendError(msg, "Not authorized to update this brandkit")
--         return
--     end
     
--     local description = tags.Description or brandkit.description
--     local folderId = tags["Arweave-Manifest-Id"] or brandkit.folderId

--     Brandkits[name] = {
--         id = brandkit.id,
--         name = brandkit.name,
--         url = brandkit.url or deriveUrl(brandkit.name),
--         description = description,
--         folderId = folderId,
--         creator = brandkit.creator,
--         is_active = brandkit.is_active
--     }

--     Send({
--         Target = msg.From,
--         Action = getAction(msg) .. "-response",
--         Data = json.encode(Brandkits[name])
--     })
-- end)
