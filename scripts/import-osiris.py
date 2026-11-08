import re
import json

def extract_array_from_file(filepath, var_name):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    pattern = rf"const\s+{var_name}\s*(?::\s*[^=]+)?=\s*(\[[\s\S]*?\]);"
    m = re.search(pattern, content)
    if not m:
        pattern2 = rf"export\s+const\s+{var_name}\s*(?::\s*[^=]+)?=\s*(\[[\s\S]*?\]);"
        m = re.search(pattern2, content)
    
    if not m:
        print(f"Could not find {var_name} in {filepath}")
        return None
    
    raw = m.group(1)
    
    # Process line by line to remove comments safely
    lines = []
    for line in raw.splitlines():
        # strip // comments
        stripped = re.sub(r"//.*$", "", line)
        lines.append(stripped)
    text = "\n".join(lines)
    
    # Replace single quotes with double quotes (handling escaped quotes)
    # Simple state machine for JS object literals to JSON
    # Remove 'as const'
    text = text.replace("as const", "")
    
    # Quote keys: e.g. { id: '...' } -> { "id": '...' }
    text = re.sub(r"([{,]\s*)([a-zA-Z0-9_]+)\s*:", r'\1"\2":', text)
    
    # Convert single-quoted string values to double-quoted strings
    # e.g. 'foo' -> "foo"
    def replace_quotes(match):
        s = match.group(1)
        # escape double quotes inside
        s = s.replace('"', '\\"')
        return f'"{s}"'
    
    text = re.sub(r"'([^']*)'", replace_quotes, text)
    
    # Remove trailing commas before } or ]
    text = re.sub(r",\s*([}\]])", r"\1", text)
    
    try:
        data = json.loads(text)
        return data
    except Exception as e:
        print(f"JSON load error for {var_name}: {e}")
        # Save scratch for debug
        with open(f"/tmp/debug_{var_name}.json", "w") as df:
            df.write(text)
        return None

# 1. Nuclear facilities
nuc_data = extract_array_from_file("/Users/yaswanth/Downloads/osiris-5.0.0/src/app/api/infrastructure/route.ts", "NUCLEAR_FACILITIES")
if nuc_data:
    print(f"Successfully extracted {len(nuc_data)} nuclear facilities")
    with open("src/data/nuclearInstallationsData.js", "w") as out:
        out.write("/**\n * @module nuclearInstallationsData\n * @description Global Nuclear Power Plants and Infrastructure (imported from OSIRIS).\n */\n\nexport const NUCLEAR_FACILITIES = " + json.dumps(nuc_data, indent=2) + ";\n")
    print("Saved to src/data/nuclearInstallationsData.js")

# 2. Maritime Ports
ports_data = extract_array_from_file("/Users/yaswanth/Downloads/osiris-5.0.0/src/app/api/maritime/route.ts", "PORTS")
if ports_data:
    print(f"Successfully extracted {len(ports_data)} global ports")
    with open("src/data/globalPortsData.js", "w") as out:
        out.write("/**\n * @module globalPortsData\n * @description Global Maritime Ports & Strategic Chokepoints (imported from OSIRIS).\n */\n\nexport const GLOBAL_PORTS = " + json.dumps(ports_data, indent=2) + ";\n")
    print("Saved to src/data/globalPortsData.js")

# 3. Known Conflicts
conflicts_data = extract_array_from_file("/Users/yaswanth/Downloads/osiris-5.0.0/src/app/api/conflicts/route.ts", "KNOWN_CONFLICTS")
if conflicts_data:
    print(f"Successfully extracted {len(conflicts_data)} conflict zones")
    with open("src/data/conflictZonesData.js", "w") as out:
        out.write("/**\n * @module conflictZonesData\n * @description Global Conflict Zones & Frontlines (imported from OSIRIS).\n */\n\nexport const CONFLICT_ZONES = " + json.dumps(conflicts_data, indent=2) + ";\n")
    print("Saved to src/data/conflictZonesData.js")
