$ErrorActionPreference = 'Continue'
$img = 'D:\Projects\aion2-guide\img'
$h = @{ 'User-Agent' = 'Mozilla/5.0'; 'Referer' = 'https://mobalytics.gg/' }
$cdn = 'https://cdn.mobalytics.gg'
$skillTpl = '/cdn-cgi/image/format=auto,width=96/assets/news/images/aion-2/skills/{0}.webp'
$classTpl = '/cdn-cgi/image/format=auto,width=192/assets/news/images/aion-2/classes/{0}.png'
$boardTpl = '/cdn-cgi/image/format=auto,width=1000/uploads/images/gamebase/{0}'

# name -> candidate slugs
$skills = [ordered]@{
  # Sorcerer
  'hellfire'                 = @('hellfire')
  'firestorm'                = @('firestorm')
  'bittercold-wind'          = @('bittercold-wind')
  'blaze'                    = @('blaze')
  'wish-of-concentration'    = @('wish-of-concentration')
  'flame-arrow'              = @('flame-arrow')
  'winters-shackles'         = @('winters-shackles')
  'fire-wall'                = @('fire-wall')
  'cold-storm'               = @('cold-storm')
  'element-enhancement'      = @('element-enhancement')
  'delayed-explosion'        = @('delayed-explosion')
  'steel-barrier'            = @('steel-barrier')
  'divine-burst'             = @('divine-burst')
  'fire-mark'                = @('fire-mark')
  'robe-of-cold'             = @('robe-of-cold')
  'robe-of-flame'            = @('robe-of-flame')
  'robe-of-earth'            = @('robe-of-earth')
  'grace-of-enhancement'     = @('grace-of-enhancement')

  # Spiritmaster
  'elemental-fusion'         = @('elemental-fusion')
  'combustion'               = @('combustion')
  'summon-fire-spirit'       = @('summon-fire-spirit')
  'cold-shock'               = @('cold-shock')
  'dimensional-control'      = @('dimensional-control')
  'jointstrike-curse'        = @('jointstrike-curse','jointstrike-curse-')
  'rapid-scattershot'        = @('rapid-scattershot')
  'summon-water-spirit'      = @('summon-water-spirit')
  'summon-earth-spirit'      = @('summon-earth-spirit')
  'summon-ancient-spirit'    = @('summon-ancient-spirit')
  'enhance-spirits-benediction' = @('enhance-spirits-benediction','enhance-spirit-s-benediction','enhance-spirits-benediction-')
  'jointstrike-corrode'      = @('jointstrike-corrode')
  'flame-blessing'           = @('flame-blessing')
  'jointstrike-destructive-attack' = @('jointstrike-destructive-attack')
  'spirit-strike'            = @('spirit-strike')
  'mental-focus'             = @('mental-focus')
  'element-unification'      = @('element-unification')
  'spirit-revitalization'    = @('spirit-revitalization')
  'corrode'                  = @('corrode')
  'spirit-protection'        = @('spirit-protection')

  # Templar
  'judgment'                 = @('judgment','judgement')
  'vicious-strike'           = @('vicious-strike')
  'pummel'                   = @('pummel')
  'punishment'               = @('punishment')
  'warding-strike'           = @('warding-strike')
  'shield-smite'             = @('shield-smite')
  'annihilate'               = @('annihilate')
  'debilitating-smash'       = @('debilitating-smash')
  'poach'                    = @('poach')
  'shield-rush'              = @('shield-rush')
  'doom-shield'              = @('doom-shield')
  'shield-of-protection'     = @('shield-of-protection')
  'noble-armor'              = @('noble-armor')
  'battlefield-banner'       = @('battlefield-banner')
  'taunt'                    = @('taunt')
  'nezekans-shield'          = @('nezekans-shield','nezekan-s-shield')
  'fury'                     = @('fury')
  'punishing-benediction'    = @('punishing-benediction')
  'insulting-roar'           = @('insulting-roar')
  'enhance-health'           = @('enhance-health')
  'ironclad-defense'         = @('ironclad-defense')
  'guarding-seal'            = @('guarding-seal')

  # Gladiator
  'overhead-slam'            = @('overhead-slam')
  'rending-blow'             = @('rending-blow')
  'ruinous-blow'             = @('ruinous-blow')
  'keen-strike'              = @('keen-strike')
  'rage-burst'               = @('rage-burst')
  'lunge-stance'             = @('lunge-stance')
  'zikels-blessing'          = @('zikels-blessing','zikel-s-blessing')
  'focused-block'            = @('focused-block')
  'sword-aura-rampage'       = @('sword-aura-rampage')
  'mocking-blade'            = @('mocking-blade')
  'leaping-slam'             = @('leaping-slam')
  'attack-preparation'       = @('attack-preparation')
  'experienced-counterstrike'= @('experienced-counterstrike')
  'murderous-burst'          = @('murderous-burst')

  # Cleric
  'condemnation'             = @('condemnation')
  'judgment-thunder'         = @('judgment-thunder','judgement-thunder')
  'radiant-recovery'         = @('radiant-recovery')
  'chain-of-torment'         = @('chain-of-torment')
  'healing-light'            = @('healing-light')
  'debilitating-mark'        = @('debilitating-mark')
  'earths-retribution'       = @('earths-retribution','earth-s-retribution')
  'bolt'                     = @('bolt')
  'divine-aura'              = @('divine-aura')
  'light-of-regeneration'    = @('light-of-regeneration')
  'noble-aura'               = @('noble-aura')
  'earth-punishment'         = @('earth-punishment')
  'prayer-of-amplification'  = @('prayer-of-amplification')
  'light-of-protection'      = @('light-of-protection')
  'empyrean-lords-grace'     = @('empyrean-lords-grace','empyrean-lord-s-grace')
  'earths-grace'             = @('earths-grace','earth-s-grace')
  'immortal-veil'            = @('immortal-veil')
  'healing-enhancement'      = @('healing-enhancement')
  'survival-willpower-cleric'= @('survival-willpower-cleric','survival-willpower')
  'warm-benediction'         = @('warm-benediction')
  'radiant-benediction'      = @('radiant-benediction')

  # Chanter
  'onslaught'                = @('onslaught')
  'dark-crush'               = @('dark-crush')
  'spinning-strike'          = @('spinning-strike')
  'recuperation'             = @('recuperation')
  'incandescent-blow'        = @('incandescent-blow')
  'impactful-crush'          = @('impactful-crush')
  'rushing-smash'            = @('rushing-smash')
  'tremor-crush'             = @('tremor-crush')
  'wave-blow'                = @('wave-blow')
  'heat-wave-blow'           = @('heat-wave-blow')
  'undefeated-mantra'        = @('undefeated-mantra')
  'sprint-mantra'            = @('sprint-mantra')
  'marchutans-wrath'         = @('marchutans-wrath','marchutan-s-wrath')
  'power-of-the-storm'       = @('power-of-the-storm')
  'winds-promise'            = @('winds-promise','wind-s-promise')
  'attack-preparation-chanter' = @('attack-preparation-chanter','attack-preparation')
  'impact-hit-chanter'       = @('impact-hit-chanter','impact-hit')
  'inspiring-spell'          = @('inspiring-spell')
  'earths-promise'           = @('earths-promise','earth-s-promise')
  'blessing-of-life'         = @('blessing-of-life')
  'survival-willpower-chanter' = @('survival-willpower-chanter','survival-willpower')
}

$missing = @()
foreach ($name in $skills.Keys) {
  $ok = $false
  foreach ($slug in $skills[$name]) {
    if ($ok) { continue }
    $u = $cdn + ($skillTpl -f $slug)
    $out = Join-Path $img "s-$name.webp"
    try {
      Invoke-WebRequest -Uri $u -OutFile $out -Headers $h -UseBasicParsing -TimeoutSec 25 | Out-Null
      if ((Get-Item $out).Length -gt 500) { $ok = $true }
    } catch { }
  }
  if (-not $ok) { $missing += $name; Write-Host "MISS skill $name" }
}
Write-Host ("skills missing: " + ($missing -join ', '))

# classes
foreach ($c in @('sorcerer','spiritmaster','templar','gladiator','cleric','chanter')) {
  try {
    Invoke-WebRequest -Uri ($cdn + ($classTpl -f $c)) -OutFile (Join-Path $img "class-$c.png") -Headers $h -UseBasicParsing -TimeoutSec 25 | Out-Null
    Write-Host "OK class $c"
  } catch { Write-Host "ERR class $c" }
}

# boards: out name -> source file name
$boards = [ordered]@{
  'so-nezekan' = 'Screenshot%202026-10-31%20104647-2ad35ba5-2ecf-4171-b121-8a768da0af2b.jpg'
  'so-zikel'   = 'Screenshot%202026-10-31%20104829-ca3d4f24-0a18-4dd5-a635-952d1b52675b.jpg'
  'so-vaizel'  = 'Screenshot%202026-10-31%20104856-18b2e82d-28cc-4b53-a740-800a7a221191.jpg'
  'so-triniel' = 'Screenshot%202026-10-31%20105037-de8ac896-5cc1-4329-bad0-22448b26def9.jpg'

  'sp-nezekan' = '1-Nezekan-cb5ab0ee-1eec-451c-8f25-6012ccfb9f71.jpg'
  'sp-zikel'   = '2-Zikel-1c4f4a25-bd72-4112-915f-f24c20eaf41b.jpg'
  'sp-vaizel'  = '3-Vaizel-8d09e267-2ba5-41aa-aa69-d06b8f1e3d00.jpg'
  'sp-triniel' = '4-Triniel-dc734ce7-b466-4683-bd19-997cf25c8f03.jpg'

  'te-e1' = 'Screenshot%202026-10-16%20173409-71807f58-3f48-4c23-abe1-4672a0d69bbd.jpg'
  'te-e2' = 'Screenshot%202026-10-16%20173845-82e66cad-7634-4720-9ec4-e9cafbb3977c.jpg'
  'te-e3' = 'Screenshot%202026-10-16%20173925-73b8ae32-4146-4615-9a81-400c9a29bcc3.jpg'
  'te-e4' = 'Screenshot%202026-10-16%20173948-d4b7e606-e840-4edd-aa51-ba60ea3d0f7f.jpg'
  'te-x1' = 'Screenshot%202026-10-16%20174204-63af856e-7d9d-4d99-be19-3fa264cd7945.jpg'
  'te-x2' = 'Screenshot%202026-10-16%20174314-7a45179b-8da6-4aa5-820f-51ee4a8eebbd.jpg'
  'te-x3' = 'Screenshot%202026-10-16%20174352-9297a89d-1213-4e5f-bebe-d8c77125c226.jpg'
  'te-x4' = 'Screenshot%202026-10-16%20174424-adc843ae-e5b6-4d43-921b-30f233457010.jpg'
  'te-macro' = 'Screenshot%202026-10-16%20172149-eb3771a8-aad9-4315-9be4-0dd940457bcb.png'

  'gl-nezekan' = 'Screenshot%202026-10-23%20022710-ad6974fe-8e68-4ccc-958b-6518ff7b44dd.jpg'
  'gl-zikel'   = 'Screenshot%202026-10-23%20022804-42640e2e-7386-4d96-85f0-ac76076d6ca4.jpg'
  'gl-vaizel'  = 'Screenshot%202026-10-23%20022828-bac0dffd-903d-4e5d-b829-964b8be307b3.jpg'
  'gl-triniel' = 'Screenshot%202026-10-23%20022847-3bc654dd-89e4-480e-9d76-312d483dff5c.jpg'
  'gl-passive' = 'Screenshot%202026-10-23%20023211-a0b9849c-a440-48bb-855b-f0d095a057db.png'
  'gl-stigma'  = 'Screenshot%202026-10-23%20023336-8b7e79a9-3eb9-4428-8bc1-1d5253e82544.jpg'
  'gl-cards'   = 'Screenshot%202026-10-23%20023827-fcf37654-6b88-4aad-9a25-31c66f420021.jpg'

  'cl-nezekan' = '1-%20Nezekan-d049f284-5de8-47f4-8d25-470a1d70fbd3.png'
  'cl-zikel'   = '2-%20Zikel-f2a27651-5830-40c1-a316-3892528b0f82.png'
  'cl-vaizel'  = '3-%20Vaizel-df4df4f3-7a5a-4d05-9a7d-b73b239304bb.png'
  'cl-triniel' = '4-%20Triniel-2fe5ebcd-f718-4e5c-8f70-b742bb65c50f.png'

  'ch-nezekan' = '1-Nezekan-1f1b5c79-10cb-4451-b07a-5ae3786b9f99.png'
  'ch-zikel'   = '2-Zikel-7996ef98-894e-4d46-a06d-fc5272b53d43.png'
  'ch-vaizel'  = '3-Vaizel-f933c665-95ed-429e-8c5c-5866379c112f.png'
  'ch-triniel' = '4-Triniel-a619d81a-fc05-492c-9892-daabd3bd82ce.png'
}
foreach ($k in $boards.Keys) {
  $u = $cdn + ($boardTpl -f $boards[$k])
  try {
    Invoke-WebRequest -Uri $u -OutFile (Join-Path $img "$k.jpg") -Headers $h -UseBasicParsing -TimeoutSec 30 | Out-Null
  } catch { Write-Host "ERR board $k" }
}

# sorcerer extra screenshots
$so = [ordered]@{
  'so-shot1' = 'Screenshot%202026-10-07%20161007-512b4b47-3417-4c25-a226-c7cbf7b8aaaf.jpg'
  'so-shot2' = 'Screenshot%202026-10-07%20161756-4baaae37-bb3f-4a42-94a6-9618aea6afc0.jpg'
  'so-shot3' = 'Screenshot%202026-10-07%20161907-ed5dfcf3-cd47-4bad-b00b-dba8bc7785ad.jpg'
  'so-shot4' = 'Screenshot%202026-10-07%20162043-7cbd812b-33ee-449d-bf34-bece769d9cc9.jpg'
  'so-shot5' = 'Screenshot%202026-10-07%20163350-86c780cf-acb4-410e-9680-d3d464b5e785.jpg'
}
foreach ($k in $so.Keys) {
  $u = $cdn + ('/cdn-cgi/image/format=auto,width=900/uploads/images/gamebase/' + $so[$k])
  try { Invoke-WebRequest -Uri $u -OutFile (Join-Path $img "$k.jpg") -Headers $h -UseBasicParsing -TimeoutSec 30 | Out-Null } catch { Write-Host "ERR $k" }
}

Get-ChildItem $img | Measure-Object -Property Length -Sum | ForEach-Object {
  Write-Host ("Files: " + $_.Count + "  Size MB: " + [math]::Round($_.Sum/1MB,2))
}
