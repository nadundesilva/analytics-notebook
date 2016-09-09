
import java.util.ArrayList;
import java.util.List;

import org.testng.Assert;
import org.testng.annotations.Test;
import org.wso2.carbon.notebook.api.endpoint.ml.preprocessor.transformation.DiscardedRowsFilter;

public class DiscardedRowsFilterTest {
    List<Integer> discardedIndices;

    public DiscardedRowsFilterTest() {
        discardedIndices = new ArrayList<Integer>();
        discardedIndices.add(0);
        discardedIndices.add(1);
        discardedIndices.add(2);
        discardedIndices.add(3);
    }

    @Test
    public void testDiscardedRowsFilter() {
        DiscardedRowsFilter discardedRowsFilter = new DiscardedRowsFilter.Builder().indices(discardedIndices).build();
        boolean shouldKeep = discardedRowsFilter.call(new String[] { "1.2", "2", "hi", "na" });
        Assert.assertEquals(shouldKeep, true);
        shouldKeep = discardedRowsFilter.call(new String[] { "17645", "231.0", "", "123.0"});
        Assert.assertEquals(shouldKeep, false);
        shouldKeep = discardedRowsFilter.call(new String[] { "1.2", "1.2", "NA", "na" });
        Assert.assertEquals(shouldKeep, false);
        shouldKeep = discardedRowsFilter.call(new String[] { "1.2", "1.112", "hi", "" });
        Assert.assertEquals(shouldKeep, false);
    }

    @Test
    public void testDiscardedRowsFilterWithNonDiscardedRows() {
        DiscardedRowsFilter discardedRowsFilter = new DiscardedRowsFilter.Builder().indices(discardedIndices).build();
        boolean shouldKeep = discardedRowsFilter.call(new String[] { "1.2", "2", "hi", "na", "4.21" });
        Assert.assertEquals(shouldKeep, true);
        shouldKeep = discardedRowsFilter.call(new String[] { "1.2", "?", "hi", "na", "4.21" });
        Assert.assertEquals(shouldKeep, false);
        shouldKeep = discardedRowsFilter.call(new String[] { "1.2", "2.11", "NA", "na", "4.21" });
        Assert.assertEquals(shouldKeep, false);
        shouldKeep = discardedRowsFilter.call(new String[] { "1.2", "1.112", "hi", "", "4.21" });
        Assert.assertEquals(shouldKeep, false);
    }
}

