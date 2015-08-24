import os
from distutils.core import setup

README = open(os.path.join(os.path.dirname(__file__), 'README.md')).read()

# allow setup.py to be run from any path
os.chdir(os.path.normpath(os.path.join(os.path.abspath(__file__), os.pardir)))

setup(
    name='django-stackedit',
    version='0.1',
    packages=['stackedit'],
    include_package_data=True,
    license='Apache2',  # example license
    description='Django port of StackEdit from Node.js.',
    long_description=README,
    url='http://www.beavlet.org',
    author='Nezar Abdennur',
    author_email='nabdennur@gmail.com',
    classifiers=[
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 2',
        'Programming Language :: Python :: 2.7',
    ],
)
