+++
title = "Simplifying research code with modern python features"
date = 2023-01-13
draft = false
weight = 1

[taxonomies]
categories = ["programming"]
tags = ["python", "genomics"]
[extra]
toc = true
keywords = "Programming, Bioinformatics, Genomics, Research, Software, Python, Dataclass, NamedTuple"
+++

Most scientific software is developed by researchers whose main area of expertise is not software engineering, and who may not have much time to dedicate to development. This often results in a tendency to ignore more advanced language features, such as failing to create custom types and instead over-rely on the language's built-in types. 

While it is arguably better to avoid over-engineering to keep the code simple and accessible to a wider audience, using more advanced features can also improve readability and maintainability in larger codebases. In such situations, sticking to the built-ins can result in a code smell known as _primitive obsession_.

Fortunately, python provides several features to easily take advantage of custom types and interfaces with little overhead. In this post, I'll be showcasing a few modern(ish) python features that can help keep your code readable, and save you time in the long term.

## 🪆 The problem

A few issues may arise when over-relying on built-ins to represent complex domain-specific models:

* Lack of custom interfaces can force more complex logic or repetitions
* Code becomes harder to read due to the absence of explicitly named fields and methods
* Maintainability suffers: changing a field may require replacing it at multiple places, as opposed to a single definition.

Let's take a look at an example that uses only built-ins organized into nested structures:

```python
genes = [
    ("geneA", ("chr1", 1002, 1200, "+")),
    ("geneB", ("chr2", 39001, 39950, "-")),
]
genome = [("chr1", 141123, [genes[0]]), ("chr2", 131312, [genes[1]])]
read = ("chr2", 39800, 40002, "-")


def read_in_gene(read, genome):
    for chrom in genome:
        if chrom[0] == read[0]:
            for gene in chrom[2]:
                starts_in = gene[1][1] <= read[1] <= gene[1][2]
                ends_in = gene[1][1] <= read[2] <= gene[1][2]
                same_sign = gene[1][3] == read[3]
                if starts_in or ends_in:
                    return True
    return False
```

> The code in this post was tested under python 3.10.4

We define a genome as a complex nested structure of built-in types (list, tuple, str, int). Then we write a function which will check whether an input read falls on a gene from a given genome. All intervals are 0-based and open.

Even with intuitive variable names (`gene` and not `g`) it takes a lot of mental effort to understand the nesting, and translate the numeric indices (e.g. `gene[1][1]`) into their meaning 🪆. This can make the code harder to understand and maintain.


## 🥉 Type hints
> TypeAlias was introduced by [PEP-613](https://peps.python.org/pep-0613/) in python 3.10 (2020)

Despite being a dynamically typed language, python provides type hints to specify the types of variables. Type hints are not enforced at runtime, but they go a long way to help the user (or yourself) understand how to use your code and structures. They are also well integrated with common IDEs, which will display hints and warn you in cases of inconsistencies.

> Tip: If you use the Pylance extension in VScode, static analysis does not use type checking by default. To enable it, go to `settings > extensions > Pylance` and set `Analysis: Type checking mode` to "strict" or "basic".

Type hints can be provided to specify the function signature. In the example above, this would be very hard to read due to the nesting:

```python
from typing import Literal

def read_in_gene(
    read: tuple[str, int, int, str, Literal['+', '-']],
    genome: list[tuple[str, int, list[str, tuple[str, int, int, Literal['+', '-']]]]],
) -> bool:
    ...
```
Moreover, if we decided to make a change in one of those structures, we would need to edit the type hints in the signature of every function that uses them. This is where `TypeAlias` and `NewType` can be useful:

```python
from typing import Literal, NewType, TypeAlias

# Use NewType to denote the meaning of a type
Name = NewType("Name", str)
Size = NewType("Size", int)

# Use TypeAlias to define equivalents to complex signatures
Interval: TypeAlias = tuple[str, int, int, Literal['+', '-']]
Gene: TypeAlias = tuple[Name, Interval]
Chrom: TypeAlias = tuple[Name, Size, list[Gene]]


def read_in_gene(read: Interval, genome: list[Chrom]) -> bool:
    ...
```

The function signature is much easier to read, and we know that the genome is represented as a list of chromosomes right away. In an IDE such as VScode or PyCharm, placing the mouse over `Chrom` will show the alias definition:

```
(type alias) Chrom: Type[tuple[Name, Size, list[tuple[Name, tuple[str, int, int, Literal['+', '-']]]]]]
```

If we needed to change some data structures, we would only need to edit the hints in the alias definition.

Type hints are a great way of documenting code, and they can even be combined with tools like [mypy](https://www.mypy-lang.org/) or [pyright](https://github.com/microsoft/pyright) to check for errors! In this example, however, the hints themselves are also hard to read because of the heavily nested structures, we need a better solution.

## 🥈 Named tuples
> NamedTuple was introduced by [PEP-526](https://peps.python.org/pep-0526/) in python 3.6 (2016)

Named tuples improve code readability by allowing name-based field access in your tuples. They also inherit regular tuple features:

```python
from collections import namedtuple

Gene = namedtuple('Gene', ['name', 'chrom', 'start', 'end', 'sign'])
gene_1 = Gene('Gene1', 'chr1', 312, 344, '+')

# Allows standard tuple operations
len(gene_1)
chrom, start, end = gene_1[1:4]

# Adds name-based access semantics
gene_1.end - gene_1.start
```

`typing.NamedTuple` is a typed variant of `namedtuple` which can be subclassed to take advantage of type annotations mentioned earlier. The definitions are more verbose, but much easier to understand:

```python
from typing import Literal, NamedTuple, Optional


class Interval(NamedTuple):
    """An optionally stranded, 0-based, open genomic interval."""

    chrom: str
    start: int
    end: int
    sign: Optional[Literal['+', '-']] = None


class Gene(NamedTuple):
    """A gene, consisting of a named entity with genomic coordinates."""

    name: str
    coord: Interval


class Chrom(NamedTuple):
    """A chromosome represented as a collection of genes"""

    name: str
    size: int
    genes: list[Gene]

genes = [
    Gene("geneA", Interval("chr1", 1002, 1200, "+")),
    Gene("geneB", Interval("chr1", 39001, 40050, "-")),
]
chroms = [Chrom("chr1", 141123, [genes[0]]), Chrom("chr2", 131312, [genes[1]])]
read = Interval(chrom="chr2", start=39800, end=40002, sign="-")
```

In this case, named tuple semantics also make it easier to figure out what's going on in the logic, but it still feels verbose and repetitive: 

```python
def read_in_gene(read: Interval, genome: list[Chrom]) -> bool:
    for chrom in genome:
        if chrom.name == read.chrom:
            for gene in chrom.genes:
                starts_in = gene.coord.start <= read.start <= gene.coord.end
                ends_in = gene.coord.start <= read.end <= gene.coord.end
                same_sign = gene.coord.sign == read.sign
                if (starts_in or ends_in) and same_sign:
                    return True
    return False
```

## 🥇 Data classes
> dataclass was introduced by [PEP-557](https://peps.python.org/pep-0557/) in python 3.7 (2017)

Dataclasses offer the flexibility of python classes with minimal administrative overhead. 
First, we can define an interval dataclass. The simplest definition we can write looks almost identical to the previous `NamedTuple` subclass:

```python
from dataclasses import dataclass, field
from typing import Literal, Optional

@dataclass
class Interval:
    """An optionally stranded, 0-based, open genomic interval."""

    chrom: str
    start: int
    end: int
    sign: Optional[Literal['+', '-']] = None

```
Again, placing the mouse over any occurrence of `Interval` should show the type hints, along with the docstring annotation:

```
`(class) Interval(chrom: str, start: int, end: int, sign: Literal['+', '-'] | None = None)`
`An optionally stranded genomic interval.`
```

Now, let's pretend that we want the ability to sort intervals (i.e. define `interval1 > interval2`). With a traditional class, this would require writing dunder methods `__lt__` and/or `__gt__` to define the behaviours of `<` and `>` operators.

With dataclasses, most dunder methods (`__init__`, `__repr__`, `__eq__`, ...) are automatically generated. Their behavior can be customized with arguments to the `@dataclass` decorator and the `field()` helper function.

For example, below, we use `order=True` to say that instances of `Interval` can be ordered. This will automatically define dunder methods `__lt__` and `__gt__`. We then use `field(compare=True)` to specify which fields should be used in the comparison.

```python
@dataclass(order=True)
class Interval:
    """An optionally stranded, 0-based, open genomic interval."""

    chrom: str = field(compare=True)
    start: int = field(compare=True)
    end: int = field(compare=True)
    sign: Optional[Literal['+', '-']] = field(default=None, compare=False)
```

Dunder methods can also be manually implemented for specific operators. For the sake of this example, we are going to define the `in` operator by defining `__contains__`. This will be used to define whether another interval (at least partially) falls in the current interval.
> For the sake of showing dataclasses, I overrid the `in` operator, but in practice, this can be confusing. A method like `Interval.overlaps(self, other)` would be a better choice.

It makes sense to move this logic into the `Interval` definition, because we will likely need to reuse it in many different functions.

```python
@dataclass(order=True)
class Interval:
    """An optionally stranded, 0-based, open genomic interval."""

    chrom: str = field(compare=True)
    start: int = field(compare=True)
    end: int = field(compare=True)
    sign: Optional[Literal['+', '-']] = field(default=None, compare=False)

    def __contains__(self, other: Interval) -> bool:
        """Checks if another interval overlaps with self."""
        starts_in = self.start <= other.start <= self.end
        ends_in = self.start <= other.end <= self.end
        same_sign = self.sign == other.sign
        return (starts_in or ends_in) and same_sign
```
Now we can sort intervals and check for overlap!
```python
>>> read_1 = Interval('c1', 10, 15)
>>> read_2 = Interval('c1', 12, 17)
>>> read_1 in read_2
True
>>> sorted([read_2, read_1])
[Interval(chrom='c1', start=10, end=15, sign=None),
 Interval(chrom='c1', start=12, end=17, sign=None)]
```
We can reuse this `Interval` to define `Gene` and `Chrom`. Since a gene is just a named interval here, we can _subclass_ `Interval` to inherit all its attributes and methods, and simply add an optional `name` attribute (or any gene-specific behavior we may want):

Since a chromosome contains a set of genes (which are a subclass of interval), we can easily define a helper method to check if a given interval overlaps any gene in a chromosome. This is shown below in `Chromosome.gene_overlaps()`.

```python
@dataclass(order=True)
class Gene(Interval):
    """A named genomic interval."""

    name: Optional[str] = field(default=None, compare=False)


@dataclass
class Chrom:
    """A chromosome, represented as a collection of named genomic intervals."""

    name: str
    size: int
    genes: list[Gene]
    
    def gene_overlaps(self, interval: Interval) -> bool:
        for gene in self.genes:
            if interval in gene:
                return True
        return False
```

With the main overlap logic taken out, this function is much easier to read than the original version. 

```python
gene_1 = Gene(name="Gene1", chrom="chr1", start=1000, end=3000, sign="-")
gene_2 = Gene(name="Gene2", chrom="chr1", start=3500, end=4100, sign="-")
chrom = Chrom("chr1", 11000, genes=[gene_1, gene_2])
read = Interval("chr1", 2500, 3200, "-")


def read_in_gene(read: Interval, genome: list[Chrom]) -> bool:
    for chrom in genome:
        if chrom.gene_overlaps(read):
            return True
    return False


read_in_gene(read, [chrom])
```

 dataclasses are more flexible than named tuples. However, they are not as fast and don't inherit the default tuple behaviors (hashable, iterable, unpackable). For a more detailed comparison, see [this stackoverflow answer by Oleksandr Yarushevski's](https://stackoverflow.com/a/5167396).


Here is the original code for comparison:

<details>
<summary>original:</summary>

```python
genes = [
    ("geneA", ("chr1", 1002, 1200, "+")),
    ("geneB", ("chr2", 39001, 39950, "-")),
]
genome = [("chr1", 141123, [genes[0]]), ("chr2", 131312, [genes[1]])]
read = ("chr2", 39800, 40002, "-")

def read_in_gene(read, genome):
    for chrom in genome:
        if chrom[0] == read[0]:
            for gene in chrom[2]:
                starts_in = gene[1][1] <= read[1] <= gene[1][2]
                ends_in = gene[1][1] <= read[2] <= gene[1][2]
                same_sign = gene[1][3] == read[3]
                if starts_in or ends_in:
                    return True
    return False
```

</details>

In summary, the complicated logic has been moved into the structure definitions, and for the better: each function is more modular (easier to read), and we can reuse them anytime we need new functions, instead of rewriting similar logic.

Using these features introduces the overhead of defining data structures. In this example, named tuples would probably be a good middle ground. For larger projects and algorithms, these definitions and the associated documentation (docstrings and type hints) represent a small cost compared to the long term gain in efficiency and clarity.

## 🍒 pydantic
> [pydantic](https://docs.pydantic.dev/) (1.10.4) compatible with python 3.7-3.11

This package is not part of python's standard library, but I really like it, and it is a very useful package if you need to serialize your classes.

It provides a `BaseModel` class with serialization methods such as `.dict()`, `.json()`, as well as additional constrained types to validate instances.

In the example below, we define `Interval` as a subclass of `BaseModel` to access its neat features:
* Constrained types: note `start` and `end` are of type `pos`, which we define as a constrained non-negative integer type with `conint`.
* Instance validation: Until now, type hints were only informative. pydantic actually enforces type hints at instantiation time. If we attempt to create a gene with a negative coordinates, or add genes in a chromosome with a different `chrom` attribute than the chromosome `name`, it will raise an exception with a clear message.

Here is the full example rewritten with pydantic:

```python
from typing import Any, Literal, Optional
from pydantic import BaseModel, conint, root_validator, NonNegativeInt

# Genomic positions can not be negative
pos = conint(ge=0)


class Interval(BaseModel):
    """An optionally stranded, 0-based, open genomic interval."""

    chrom: str
    start: pos
    end: pos
    sign: Optional[Literal["-", "+"]]

    def __contains__(self, other: Interval) -> bool:
        """Checks if another interval overlaps with self."""
        starts_in = self.start <= other.start <= self.end
        ends_in = self.start <= other.end <= self.end
        same_sign = self.sign == other.sign
        return starts_in or ends_in and same_sign


class Gene(Interval):
    """A named genomic interval."""

    name: Optional[str]


class Chrom(BaseModel):
    """A chromosome, represented as a collection of named genomic intervals."""

    name: str
    size: NonNegativeInt
    genes: list[Gene] = []

    @root_validator(allow_reuse=True)
    def genes_on_chrom(cls, values: dict[str, Any]) -> dict[str, Any]:
        """Checks that input genes are on the right chromosome."""
        genes = values.get("genes")
        curr_chrom = values.get("name")
        if genes is None:
            return values
        for gene in genes:
            if gene.chrom != curr_chrom:
                raise ValueError(
                    f"{gene.name} is on {gene.chrom} but should be on {curr_chrom}"
                )
        return values
```
If we try to enter a gene with negative coordinates, we get a clear error:
```python
>>> gene_1 = Gene(name="Gene1", chrom="chr1", start=-1, end=3000, sign="-")
[...]
pydantic.error_wrappers.ValidationError: 1 validation error for Gene
start
  ensure this value is greater than or equal to 0 (type=value_error.number.not_ge; limit_value=0)
```
Similarly, we cannot enter a gene from the chr1 into chr2:

```python
>>> gene_1 = Gene(name="Gene1", chrom="chr1", start=-1, end=3000, sign="-")
>>> chrom_2 = Chrom(name="chr2", size=11000, genes=[gene_1])
pydantic.error_wrappers.ValidationError: 1 validation error for Chrom
__root__
  Gene2 is on chr2 but should be on chr1 (type=value_error)[...]
```

Finally, pydantic allows serializing the instance to json. This is great for interoperability, as many tools are compatible with this format, and it is also simple to convert common genomic formats to or from json:

```python
>>> gene_1 = Gene(name="Gene1", chrom="chr1", start=1000, end=3000, sign="-")
>>> gene_2 = Gene(name="Gene2", chrom="chr1", start=3500, end=4100, sign="-")
>>> chrom = Chrom(name="chr1", size=11000, genes=[gene_1, gene_2])
>>> print(chrom.json(indent=2))
{
  "name": "chr1",
  "size": 11000,
  "genes": [
    {
      "chrom": "chr1",
      "start": 1000,
      "end": 3000,
      "sign": "-",
      "name": "Gene1"
    },
    {
      "chrom": "chr1",
      "start": 3500,
      "end": 4100,
      "sign": "-",
      "name": "Gene2"
    }
  ]
}
```
Similarly, the parse_file method can instantiate the class directly from a json file!
```python
>>> Chrom.parse_file('test.json')
Chrom(name='chr1', size=11000, genes=[Gene(chrom='chr1', start=1000, end=3000, sign='-', name='Gene1'), Gene(chrom='chr1', start=3500, end=4100, sign='-', name='Gene2')])
```
The object can also be converted into a json schema using Chrom.schema_json(). This can be very useful for validating data in other tools.

<details>
<summary>json schema</summary>

```json
{
  "title": "Chrom",
  "description": "A chromosome, represented as a collection of named genomic intervals.",
  "type": "object",
  "properties": {
    "name": {
      "title": "Name",
      "type": "string"
    },
    "size": {
      "title": "Size",
      "minimum": 0,
      "type": "integer"
    },
    "genes": {
      "title": "Genes",
      "default": [],
      "type": "array",
      "items": {
        "$ref": "#/definitions/Gene"
      }
    }
  },
  "required": [
    "name",
    "size"
  ],
  "definitions": {
    "Gene": {
      "title": "Gene",
      "description": "A named genomic interval.",
      "type": "object",
      "properties": {
        "chrom": {
          "title": "Chrom",
          "type": "string"
        },
        "start": {
          "title": "Start",
          "minimum": 0,
          "type": "integer"
        },
        "end": {
          "title": "End",
          "minimum": 0,
          "type": "integer"
        },
        "sign": {
          "title": "Sign",
          "enum": [
            "-",
            "+"
          ],
          "type": "string"
        },
        "name": {
          "title": "Name",
          "type": "string"
        }
      },
      "required": [
        "chrom",
        "start",
        "end"
      ]
    }
  }
}
```

</details>
