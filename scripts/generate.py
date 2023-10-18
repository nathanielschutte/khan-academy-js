import os
import shutil
import glob
import re

EXCLUDE_PROJECTS = [
    'new',
    'halfpipe',
    '3d aimbot (wip)',
    'ant walk',
    'direction function'
]

content = ''
with open('./html/index.template', 'r') as f:
    content = f.read()

list_items = ''

SETUP = '''
function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
  {setupScript}
}
'''

for file in glob.glob('./html/projects/*.html'):
    os.remove(file)

for file in os.listdir('./'):
    if not file.endswith('.js'):
        continue

    if '.'.join(file.split('.')[:-1]) in EXCLUDE_PROJECTS:
        continue

    new_name = file.replace(' ', '_')
    new_name = new_name.replace(',', '')
    new_name = new_name.replace('(', '')
    new_name = new_name.replace(')', '')
    new_name = new_name.replace('.js', '.html')

    with open('./html/projects/game.template', 'r') as f_template:
        with open(f'./html/projects/{new_name}', 'w') as f_output:
            with open(f'./{file}', 'r') as f_script:
                template = f_template.read()
                script = f_script.read()
                
                # frameRateLine = re.search(r'frameRate\((.*)\);', script)
                # setupScript = ''
                # if frameRateLine:
                #     frameRate = frameRateLine.group(1)
                #     script = script.replace(frameRateLine.group(0), '')
                #     setupScript += f'frameRate({frameRate});'

                script = script.replace('pushMatrix();', 'push();')
                script = script.replace('popMatrix();', 'pop();')
                script = script.replace('createFont', 'textFont')
                script = script.replace('var draw = function', 'draw = function')
                script = script.replace('colorMode(HSB)', 'colorMode(HSB, 255)')

                setupScript = script

                finalScript = SETUP.replace('{setupScript}', setupScript)

                output = template.format(script=finalScript, title=new_name.replace('.html', ''))
                f_output.write(f'{output}')

    list_items += f'\n\t\t\t<li><a href="projects/{new_name}">{file}</a></li>'

output = content.format(list_items=list_items)

with open('./html/index.html', 'w') as f:
    f.write(output)
