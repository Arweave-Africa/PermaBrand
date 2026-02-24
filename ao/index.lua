local json = require("json")

Brandkits = {} -- { [name] = { id, name, description, folderId, owner } }

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

Handlers.add("add-brandkit", "add-brandkit", function(msg)
    local tags = msg.Tags or {}
    local name = (tags.Name or ""):lower()
    local description = tags.Description or ""
    local folder_id = tags["Arweave-Manifest-Id"] or ""

    if #name <= 1 then
        sendError(msg, "Name too short")
        return
    end

    if Brandkits[name] then
        sendError(msg, "Brandkit already exists")
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
        description = description,
        folderId = folder_id,
        owner = msg.From
    }

    Brandkits[name] = brandkit

    Send({
      device = 'patch@1.0',
      brandkits = Brandkits
    })
end)

Handlers.add("get-brandkit", "get-brandkit", function(msg)
    local tags = msg.Tags or {}
    local name = tags.Name or ""
    if not name or name == "" then
        sendError(msg, "Name is required")
        return
    end

    local brandkit = Brandkits[name]
    if not brandkit then
        sendError(msg, "Brandkit not found")
        return
    end 

    Send({
        Target = msg.From,
        Action = getAction(msg) .. "-response",
        Data = json.encode(brandkit)
    })
end)

Handlers.add("update-brandkit", "update-brandkit", function(msg)
    local tags = msg.Tags or {}
    local name = tags.Name or ""
    if not name or name == "" then
        sendError(msg, "Name is required")
        return
    end

    local brandkit = Brandkits[name]
    if not brandkit then
        sendError(msg, "Brandkit not found")
        return
    end

    if brandkit.owner ~= msg.From then
        sendError(msg, "Not authorized to update this brandkit")
        return
    end
     
    local description = tags.Description or brandkit.description
    local folderId = tags["Arweave-Manifest-Id"] or brandkit.folderId

    Brandkits[name] = {
        id = brandkit.id,
        name = brandkit.name,
        description = description,
        folderId = folderId,
        owner = brandkit.owner
    }

    Send({
        Target = msg.From,
        Action = getAction(msg) .. "-response",
        Data = json.encode(Brandkits[name])
    })
end)
