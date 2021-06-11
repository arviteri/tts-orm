# tts-orm (Tiny TypeScript ORM)
Lightweight TypeScript ORM.

## Installation

npm: `npm install @tinyts/tts-orm`
<br/>
Yarn: `yarn add @tinyts/tts-orm`

## Usage
Details of usage can also be found in the integration tests. See `__tests__/integration`.

### Connecting to a database.
Create a class which implements the `ConnectionInterface`. Initialize tts-orm using your connection class. See initialization steps below.
```
import { ConnectionInterface } from '@tinyts/tts-orm';

export class Connection implements ConnectionInterface {
    ...
}
```


### Initializing tts-orm
The EntityManager instance returned upon initialization can be used to save and delete models. It's automatically connected to the ActiveModel class upon initialization.
```
import { init } from '@tinyts/tts-orm'
import { Connection } from './your_connection_file';

const entityManager: EntityManager = init({
    connection: new Connection()
});
```

### Defining models
If you're using the active record implementation, make sure your models extend ActiveModel.
```
import { Model, Column, ActiveModel } from '@tinyts/tts-orm';

@Model({table: 'People'})
class Person extends ActiveModel {
    @Column({primary: true, autoIncrements: true})
    private id: number;
    
    // Define the column name if your property name is not the same.
    @Column({name: 'first_name', nullable: false})
    private firstName: string;
    
    // Columns are nullable by default.
    @Column({name: 'last_name', nullable: false})
    private lastName: string;
    
    @Column()
    private height: number | null;
}
```

### Active Record
Use Active Record pattern by extending ActiveModel.
```
import { Person } from './person'; // See `Defining Models` for this definition.

const p = new Person();
person.firstName = 'John';
person.lastName = 'Doe';

// Save and delete
await p.save();
await p.delete();

// Querying
const johns = await Person.where('first_name', 'John', '=').all();
```

### Repository
Encapsulate model read operations inside of repository classes.
```
import { AbstractRepository } from '@tinyts/tts-orm';
import { entityManager } from './my_initialization_file';
import { MyModel } from './my_model_file';

class MyModelRepository extends AbstractRepository {
    constructor() {
        super(MyModel, entityManager);
    }
    
    findAll(): Promise<MyModel[]> {
        const query = {
            sql: 'SELECT * FROM MyModels';
            parameters: []
        };
        
        // Results from this.query are instances of the model.
        return this.query(query) as Promise<MyModel[]>;
    }
}
```

## License (MIT)

Copyright © 2021 Andrew Viteri

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
